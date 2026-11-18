const FACTORY_CONFIG = {
  wotan: {
    cabang: 'IPW',
    categories: ['PIPA', 'FITTING'],
  },
  cirebon: {
    cabang: 'IPC',
    categories: ['PIPA', 'FITTING', 'SELANG'],
  },
  all: {
    cabang: '%',
    categories: ['PIPA', 'FITTING', 'SELANG'],
  },
};

const CATEGORY_META = {
  PIPA: {
    sectionKey: 'pipa',
    cardTitle: 'Hasil Produksi Pipa',
    totalLabel: 'TOTAL HASIL PRODUKSI PIPA',
  },
  FITTING: {
    sectionKey: 'fitting',
    cardTitle: 'Hasil Produksi Fitting',
    totalLabel: 'TOTAL HASIL PRODUKSI FITTING',
  },
  SELANG: {
    sectionKey: 'selang',
    cardTitle: 'Hasil Produksi Selang',
    totalLabel: 'TOTAL HASIL PRODUKSI SELANG',
  },
};

function getYesterdayDateInJakarta() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = Number.parseInt(parts.find((part) => part.type === 'year')?.value || '0', 10);
  const month = Number.parseInt(parts.find((part) => part.type === 'month')?.value || '0', 10);
  const day = Number.parseInt(parts.find((part) => part.type === 'day')?.value || '0', 10);

  const todayJakartaUtc = new Date(Date.UTC(year, month - 1, day));
  const yesterdayJakartaUtc = new Date(todayJakartaUtc.getTime() - (24 * 60 * 60 * 1000));

  const y = yesterdayJakartaUtc.getUTCFullYear();
  const m = String(yesterdayJakartaUtc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(yesterdayJakartaUtc.getUTCDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function parseMetricNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;

  const trimmed = value.trim();
  if (!trimmed) return 0;

  const normalized = trimmed.replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatTonLabel(value) {
  return `${Math.round(value).toLocaleString('id-ID')} Ton`;
}

function toPercent(part, total) {
  if (!total) return 0;
  return (part / total) * 100;
}

function buildCard(title, target, actual, color) {
  const pct = toPercent(actual, target);
  const gap = actual - target;

  return {
    title,
    target: formatTonLabel(target),
    actual: formatTonLabel(actual),
    pct: `${pct.toFixed(1)}%`,
    gap: `${gap >= 0 ? '+' : ''}${Math.round(gap).toLocaleString('id-ID')} Ton`,
    color,
  };
}

function formatDateLabel(date) {
  const [year, month, day] = date.split('-').map((v) => Number.parseInt(v, 10));
  const monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][month - 1] || '';
  if (!year || !month || !day || !monthLabel) return date;
  return `${day} ${monthLabel}`;
}

function mapRawRow(row) {
  return {
    branch: String(row?.Branch || row?.branch || '').toUpperCase(),
    date: String(row?.dt || row?.date || ''),
    category: String(row?.['Group Product'] || row?.groupProduct || row?.group_product || '').toUpperCase(),
    productFamily: String(row?.['Product Family'] || row?.productFamily || row?.product_family || '').trim(),
    prodPlan: parseMetricNumber(row?.ProdPlan ?? row?.prodPlan ?? row?.prod_plan),
    prodActual: parseMetricNumber(row?.ProdActual ?? row?.prodActual ?? row?.prod_actual),
  };
}

function aggregateRows(rows) {
  const aggregated = new Map();

  rows.forEach((raw) => {
    const row = mapRawRow(raw);
    if (!row.category || !row.productFamily) return;

    const key = `${row.category}::${row.productFamily}`;
    const current = aggregated.get(key) || {
      category: row.category,
      productFamily: row.productFamily,
      prodPlan: 0,
      prodActual: 0,
    };

    current.prodPlan += row.prodPlan;
    current.prodActual += row.prodActual;
    aggregated.set(key, current);
  });

  return Array.from(aggregated.values());
}

function buildLineSectionRows(aggregatedRows, categoryKey, dateKey) {
  const categoryRows = aggregatedRows
    .filter((row) => row.category === categoryKey)
    .sort((a, b) => a.productFamily.localeCompare(b.productFamily));

  const rows = categoryRows.map((row) => {
    const pct = toPercent(row.prodActual, row.prodPlan);
    return {
      key: `${categoryKey}-${row.productFamily}`,
      label: row.productFamily,
      isTotal: false,
      monthly: {
        target: row.prodPlan,
        actual: row.prodActual,
        pct,
        met: row.prodActual >= row.prodPlan,
      },
      cells: [
        {
          key: dateKey,
          label: formatDateLabel(dateKey),
          target: row.prodPlan,
          actual: row.prodActual,
          pct,
          met: row.prodActual >= row.prodPlan,
        },
      ],
    };
  });

  const totalPlan = categoryRows.reduce((sum, row) => sum + row.prodPlan, 0);
  const totalActual = categoryRows.reduce((sum, row) => sum + row.prodActual, 0);
  const totalPct = toPercent(totalActual, totalPlan);

  rows.push({
    key: `total-${categoryKey}`,
    label: CATEGORY_META[categoryKey].totalLabel,
    isTotal: true,
    monthly: {
      target: totalPlan,
      actual: totalActual,
      pct: totalPct,
      met: totalActual >= totalPlan,
    },
    cells: [
      {
        key: dateKey,
        label: formatDateLabel(dateKey),
        target: totalPlan,
        actual: totalActual,
        pct: totalPct,
        met: totalActual >= totalPlan,
      },
    ],
  });

  return rows;
}

function buildDailyPayload(factory, aggregatedRows, dateKey) {
  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const categories = config.categories;
  const columns = [{ key: dateKey, label: formatDateLabel(dateKey), type: 'day' }];

  const totalsByCategory = categories.reduce((acc, category) => {
    const rows = aggregatedRows.filter((row) => row.category === category);
    const target = rows.reduce((sum, row) => sum + row.prodPlan, 0);
    const actual = rows.reduce((sum, row) => sum + row.prodActual, 0);
    acc[category] = { target, actual };
    return acc;
  }, {});

  const totalTarget = categories.reduce((sum, category) => sum + (totalsByCategory[category]?.target || 0), 0);
  const totalActual = categories.reduce((sum, category) => sum + (totalsByCategory[category]?.actual || 0), 0);

  const cards = categories.map((category) => {
    const categoryMeta = CATEGORY_META[category];
    const categoryTotal = totalsByCategory[category] || { target: 0, actual: 0 };
    return buildCard(
      categoryMeta.cardTitle,
      categoryTotal.target,
      categoryTotal.actual,
      category === 'PIPA' ? 'primary' : category === 'FITTING' ? 'secondary' : 'tertiary',
    );
  });

  const lineData = {
    pipa: {
      columns,
      rows: buildLineSectionRows(aggregatedRows, 'PIPA', dateKey),
    },
    fitting: {
      columns,
      rows: buildLineSectionRows(aggregatedRows, 'FITTING', dateKey),
    },
    selang: {
      columns,
      rows: categories.includes('SELANG') ? buildLineSectionRows(aggregatedRows, 'SELANG', dateKey) : [],
    },
  };

  return {
    metrics: {
      kpi: {
        target: formatTonLabel(totalTarget),
        actual: formatTonLabel(totalActual),
        achievement: `${toPercent(totalActual, totalTarget).toFixed(1)}%`,
      },
      cards,
    },
    lineData,
  };
}

export async function fetchDailyProduction(factory) {
  const baseUrl = process.env.BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('BASE_URL or API_KEY is not configured on server environment');
  }

  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const dateKey = getYesterdayDateInJakarta();

  const requests = config.categories.map(async (category) => {
    const response = await fetch(`${baseUrl}/daily-production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      cache: 'no-store',
      body: JSON.stringify({
        tanggal_awal: dateKey,
        tanggal_akhir: dateKey,
        cabang: config.cabang,
        kategori: category,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend daily-production failed (${response.status}): ${errorText || response.statusText}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  });

  const responses = await Promise.all(requests);
  const mergedRows = responses.flat();
  const aggregatedRows = aggregateRows(mergedRows);
  const normalizedPayload = buildDailyPayload(factory, aggregatedRows, dateKey);

  return {
    date: dateKey,
    factory,
    ...normalizedPayload,
  };
}
