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

const PERIOD_CONFIG = {
  daily: {
    endpoint: 'daily-production',
    getRange: () => {
      const yesterday = getYesterdayDateInJakarta();
      return {
        startDate: yesterday,
        endDate: yesterday,
        columnDates: [yesterday],
      };
    },
  },
  weekly: {
    endpoint: 'weekly-production',
    getRange: () => {
      const today = getTodayDateInJakarta();
      const start = offsetDateString(today, -6);
      return {
        startDate: start,
        endDate: today,
        columnDates: buildDateRangeDescending(start, today),
      };
    },
  },
  monthly: {
    endpoint: 'daily-production',
    getRange: () => {
      const today = getTodayDateInJakarta();
      const start = getFirstDateOfMonth(today);
      return {
        startDate: start,
        endDate: today,
        columnDates: buildDateRangeDescending(start, today),
      };
    },
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

function getTodayDateInJakarta() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value || '0000';
  const month = parts.find((part) => part.type === 'month')?.value || '00';
  const day = parts.find((part) => part.type === 'day')?.value || '00';

  return `${year}-${month}-${day}`;
}

function parseIsoDateUtc(dateValue) {
  const [year, month, day] = String(dateValue || '').split('-').map((value) => Number.parseInt(value, 10));
  return new Date(Date.UTC(year || 0, (month || 1) - 1, day || 1));
}

function formatIsoDateUtc(dateObj) {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function offsetDateString(baseDate, offsetDays) {
  const utcDate = parseIsoDateUtc(baseDate);
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetDays);
  return formatIsoDateUtc(utcDate);
}

function getYesterdayDateInJakarta() {
  return offsetDateString(getTodayDateInJakarta(), -1);
}

function getFirstDateOfMonth(dateValue) {
  const [year, month] = String(dateValue || '').split('-');
  return `${year}-${month}-01`;
}

function getYearAndMonth(dateValue) {
  const [year, month] = String(dateValue || '').split('-').map((value) => Number.parseInt(value, 10));
  return {
    year,
    month,
  };
}

function buildDateRangeDescending(startDate, endDate) {
  const start = parseIsoDateUtc(startDate);
  const end = parseIsoDateUtc(endDate);
  const output = [];

  const cursor = new Date(end.getTime());
  while (cursor >= start) {
    output.push(formatIsoDateUtc(cursor));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return output;
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

function getMonthLabel(monthNumber) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'][monthNumber - 1] || '';
}

function normalizeApiDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const isoLikeMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoLikeMatch) {
    const [, year, month, day] = isoLikeMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const dmyMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return raw;
}

function mapRawRow(row) {
  return {
    branch: String(row?.Branch || row?.branch || '').toUpperCase(),
    date: normalizeApiDate(row?.['Posting Date'] || row?.postingDate || row?.posting_date || row?.dt || row?.date || ''),
    category: String(row?.['Group Product'] || row?.groupProduct || row?.group_product || '').toUpperCase(),
    productFamily: String(row?.['Product Family'] || row?.productFamily || row?.product_family || '').trim(),
    prodPlan: parseMetricNumber(row?.ProdPlan ?? row?.prodPlan ?? row?.prod_plan),
    prodActual: parseMetricNumber(row?.ProdActual ?? row?.prodActual ?? row?.prod_actual),
  };
}

function aggregateRows(rows) {
  const aggregatedByDate = new Map();
  const totalsByCategory = new Map();

  rows.forEach((raw) => {
    const row = mapRawRow(raw);
    if (!row.category || !row.productFamily || !row.date) return;

    const dateKey = `${row.category}::${row.productFamily}::${row.date}`;
    const currentByDate = aggregatedByDate.get(dateKey) || {
      category: row.category,
      productFamily: row.productFamily,
      date: row.date,
      prodPlan: 0,
      prodActual: 0,
    };

    currentByDate.prodPlan += row.prodPlan;
    currentByDate.prodActual += row.prodActual;
    aggregatedByDate.set(dateKey, currentByDate);

    const currentByCategory = totalsByCategory.get(row.category) || { target: 0, actual: 0 };
    currentByCategory.target += row.prodPlan;
    currentByCategory.actual += row.prodActual;
    totalsByCategory.set(row.category, currentByCategory);
  });

  return {
    aggregatedByDate,
    totalsByCategory,
  };
}

function getYearMonthKey(raw, mappedRow) {
  const rawYear = Number.parseInt(raw?.yrs ?? raw?.year ?? '', 10);
  const rawMonth = Number.parseInt(raw?.mth ?? raw?.month ?? '', 10);

  if (rawYear && rawMonth) {
    return `${rawYear}-${String(rawMonth).padStart(2, '0')}`;
  }

  if (mappedRow?.date && /^\d{4}-\d{2}-\d{2}$/.test(mappedRow.date)) {
    return mappedRow.date.slice(0, 7);
  }

  if (mappedRow?.date && /^\d{4}-\d{2}$/.test(mappedRow.date)) {
    return mappedRow.date;
  }

  return '';
}

function aggregateRowsByMonth(rows) {
  const aggregatedByDate = new Map();
  const totalsByCategory = new Map();

  rows.forEach((raw) => {
    const row = mapRawRow(raw);
    const monthKey = getYearMonthKey(raw, row);
    if (!row.category || !row.productFamily || !monthKey) return;

    const key = `${row.category}::${row.productFamily}::${monthKey}`;
    const currentByMonth = aggregatedByDate.get(key) || {
      category: row.category,
      productFamily: row.productFamily,
      date: monthKey,
      prodPlan: 0,
      prodActual: 0,
    };

    currentByMonth.prodPlan += row.prodPlan;
    currentByMonth.prodActual += row.prodActual;
    aggregatedByDate.set(key, currentByMonth);

    const currentByCategory = totalsByCategory.get(row.category) || { target: 0, actual: 0 };
    currentByCategory.target += row.prodPlan;
    currentByCategory.actual += row.prodActual;
    totalsByCategory.set(row.category, currentByCategory);
  });

  return {
    aggregatedByDate,
    totalsByCategory,
  };
}

function aggregateCategoryTotals(rows) {
  const totalsByCategory = new Map();

  rows.forEach((raw) => {
    const row = mapRawRow(raw);
    if (!row.category) return;

    const current = totalsByCategory.get(row.category) || { target: 0, actual: 0 };
    current.target += row.prodPlan;
    current.actual += row.prodActual;
    totalsByCategory.set(row.category, current);
  });

  return totalsByCategory;
}

function getDailyCellValue(aggregatedByDate, category, productFamily, dateKey) {
  const row = aggregatedByDate.get(`${category}::${productFamily}::${dateKey}`);
  const target = row?.prodPlan || 0;
  const actual = row?.prodActual || 0;
  const pct = toPercent(actual, target);

  return {
    key: dateKey,
    label: formatDateLabel(dateKey),
    target,
    actual,
    pct,
    met: actual >= target,
  };
}

function buildLineSectionRows(aggregatedByDate, categoryKey, columns) {
  const productFamilies = Array.from(
    new Set(
      Array.from(aggregatedByDate.values())
        .filter((row) => row.category === categoryKey)
        .map((row) => row.productFamily),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const rows = productFamilies.map((productFamily) => {
    const cells = columns.map((column) => getDailyCellValue(aggregatedByDate, categoryKey, productFamily, column.key));
    const totalTarget = cells.reduce((sum, cell) => sum + cell.target, 0);
    const totalActual = cells.reduce((sum, cell) => sum + cell.actual, 0);
    const count = cells.length || 1;
    const avgTarget = totalTarget / count;
    const avgActual = totalActual / count;
    const totalPct = toPercent(avgActual, avgTarget);

    return {
      key: `${categoryKey}-${productFamily}`,
      label: productFamily,
      isTotal: false,
      monthly: {
        target: avgTarget,
        actual: avgActual,
        pct: totalPct,
        met: avgActual >= avgTarget,
      },
      cells,
    };
  });

  const totalCells = columns.map((column) => {
    const target = rows.reduce((sum, row) => {
      const cell = row.cells.find((item) => item.key === column.key);
      return sum + (cell?.target || 0);
    }, 0);
    const actual = rows.reduce((sum, row) => {
      const cell = row.cells.find((item) => item.key === column.key);
      return sum + (cell?.actual || 0);
    }, 0);

    return {
      key: column.key,
      label: column.label,
      target,
      actual,
      pct: toPercent(actual, target),
      met: actual >= target,
    };
  });

  const totalTarget = totalCells.reduce((sum, cell) => sum + cell.target, 0);
  const totalActual = totalCells.reduce((sum, cell) => sum + cell.actual, 0);
  const count = totalCells.length || 1;
  const avgTarget = totalTarget / count;
  const avgActual = totalActual / count;
  const totalPct = toPercent(avgActual, avgTarget);

  rows.push({
    key: `total-${categoryKey}`,
    label: CATEGORY_META[categoryKey].totalLabel,
    isTotal: true,
    monthly: {
      target: avgTarget,
      actual: avgActual,
      pct: totalPct,
      met: avgActual >= avgTarget,
    },
    cells: totalCells,
  });

  return rows;
}

function buildMetrics(factory, totalsByCategory) {
  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const categories = config.categories;

  const totalTarget = categories.reduce((sum, category) => sum + (totalsByCategory.get(category)?.target || 0), 0);
  const totalActual = categories.reduce((sum, category) => sum + (totalsByCategory.get(category)?.actual || 0), 0);

  const cards = categories.map((category) => {
    const categoryMeta = CATEGORY_META[category];
    const categoryTotal = totalsByCategory.get(category) || { target: 0, actual: 0 };
    return buildCard(
      categoryMeta.cardTitle,
      categoryTotal.target,
      categoryTotal.actual,
      category === 'PIPA' ? 'primary' : category === 'FITTING' ? 'secondary' : 'tertiary',
    );
  });

  return {
    kpi: {
      target: formatTonLabel(totalTarget),
      actual: formatTonLabel(totalActual),
      achievement: `${toPercent(totalActual, totalTarget).toFixed(1)}%`,
    },
    cards,
  };
}

function buildLineData(factory, aggregatedByDate, columns) {
  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const categories = config.categories;

  return {
    pipa: {
      columns,
      rows: buildLineSectionRows(aggregatedByDate, 'PIPA', columns),
    },
    fitting: {
      columns,
      rows: buildLineSectionRows(aggregatedByDate, 'FITTING', columns),
    },
    selang: {
      columns,
      rows: categories.includes('SELANG') ? buildLineSectionRows(aggregatedByDate, 'SELANG', columns) : [],
    },
  };
}

function buildDailyPayload(factory, aggregateResult, columns) {
  const { aggregatedByDate, totalsByCategory } = aggregateResult;
  const metrics = buildMetrics(factory, totalsByCategory);
  const lineData = buildLineData(factory, aggregatedByDate, columns);

  return {
    metrics,
    lineData,
  };
}

function getBackendConfig() {
  const rawBaseUrl = process.env.BASE_URL;
  const rawApiKey = process.env.API_KEY;

  const baseUrl = String(rawBaseUrl || '').trim().replace(/\/+$/, '');
  const apiKey = String(rawApiKey || '').trim();

  if (!baseUrl || !apiKey) {
    throw new Error('BASE_URL or API_KEY is not configured on server environment');
  }

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error('BASE_URL is invalid. Use full URL format like https://example.com/path');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('BASE_URL must use http or https protocol');
  }

  return {
    baseUrl,
    apiKey,
  };
}

function getFetchResilienceConfig() {
  const timeoutMs = Number.parseInt(process.env.BACKEND_FETCH_TIMEOUT_MS || '15000', 10);
  const maxRetries = Number.parseInt(process.env.BACKEND_FETCH_RETRIES || '2', 10);
  const baseDelayMs = Number.parseInt(process.env.BACKEND_FETCH_RETRY_DELAY_MS || '400', 10);

  return {
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15000,
    maxRetries: Number.isFinite(maxRetries) && maxRetries >= 0 ? maxRetries : 2,
    baseDelayMs: Number.isFinite(baseDelayMs) && baseDelayMs > 0 ? baseDelayMs : 400,
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAttemptDelayMs(baseDelayMs, attempt) {
  const jitter = Math.floor(Math.random() * 120);
  return (baseDelayMs * (2 ** (attempt - 1))) + jitter;
}

function isRetryableNetworkError(error) {
  const message = String(error?.message || '').toLowerCase();
  const causeMessage = String(error?.cause?.message || '').toLowerCase();
  const combined = `${message} ${causeMessage}`;

  return (
    combined.includes('econnreset')
    || combined.includes('etimedout')
    || combined.includes('econnrefused')
    || combined.includes('enotfound')
    || combined.includes('socket hang up')
    || combined.includes('fetch failed')
    || combined.includes('networkerror')
    || combined.includes('aborted')
  );
}

function isRetryableHttpStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function requestCategoryData({ baseUrl, apiKey, endpoint, categories, bodyBuilder }) {
  const { timeoutMs, maxRetries, baseDelayMs } = getFetchResilienceConfig();
  const allRows = [];

  for (const category of categories) {
    let successPayload = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
      let response;

      try {
        const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(timeoutMs)
          : undefined;

        response = await fetch(`${baseUrl}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          cache: 'no-store',
          body: JSON.stringify(bodyBuilder(category)),
          ...(signal ? { signal } : {}),
        });
      } catch (error) {
        const retryable = isRetryableNetworkError(error);
        const canRetry = retryable && attempt <= maxRetries;

        if (canRetry) {
          await wait(getAttemptDelayMs(baseDelayMs, attempt));
          continue;
        }

        const causeMessage =
          error && typeof error === 'object' && 'cause' in error && error.cause instanceof Error
            ? error.cause.message
            : '';
        const errorMessage = error.message || "No Error Message";
        let suffix = causeMessage ? ` | cause: ${causeMessage}` : '';
        suffix += ` errorMessage: ${errorMessage}`
        throw new Error(
          `Backend ${endpoint} fetch failed for category ${category} after ${attempt} attempt(s)${suffix} ${error} ${error.stack} ${error.cause}`,
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        const canRetry = isRetryableHttpStatus(response.status) && attempt <= maxRetries;

        if (canRetry) {
          await wait(getAttemptDelayMs(baseDelayMs, attempt));
          continue;
        }

        throw new Error(
          `Backend ${endpoint} failed (${response.status}) for category ${category} after ${attempt} attempt(s): ${errorText || response.statusText}`,
        );
      }

      const payload = await response.json();
      successPayload = Array.isArray(payload) ? payload : [];
      break;
    }

    if (!successPayload) {
      throw new Error(`Backend ${endpoint} returned empty payload state for category ${category}`);
    }

    allRows.push(...successPayload);
  }

  return allRows;
}

async function fetchProductionByPeriod(factory, period) {
  const { baseUrl, apiKey } = getBackendConfig();

  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const periodConfig = PERIOD_CONFIG[period] || PERIOD_CONFIG.daily;
  const { startDate, endDate, columnDates } = periodConfig.getRange();
  const columns = columnDates.map((dateValue) => ({
    key: dateValue,
    label: formatDateLabel(dateValue),
    type: 'day',
  }));

  const mergedRows = await requestCategoryData({
    baseUrl,
    apiKey,
    endpoint: periodConfig.endpoint,
    categories: config.categories,
    bodyBuilder: (category) => ({
      tanggal_awal: startDate,
      tanggal_akhir: endDate,
      cabang: config.cabang,
      kategori: category,
    }),
  });

  const aggregateResult = aggregateRows(mergedRows);
  const normalizedPayload = buildDailyPayload(factory, aggregateResult, columns);

  return {
    period,
    tanggal_awal: startDate,
    tanggal_akhir: endDate,
    factory,
    ...normalizedPayload,
  };
}

export async function fetchDailyProduction(factory) {
  return fetchProductionByPeriod(factory, 'daily');
}

export async function fetchWeeklyProduction(factory) {
  return fetchProductionByPeriod(factory, 'weekly');
}

export async function fetchMonthlyProduction(factory) {
  const { baseUrl, apiKey } = getBackendConfig();

  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const today = getTodayDateInJakarta();
  const firstDate = getFirstDateOfMonth(today);
  const { year, month } = getYearAndMonth(today);
  const columns = buildDateRangeDescending(firstDate, today).map((dateValue) => ({
    key: dateValue,
    label: formatDateLabel(dateValue),
    type: 'day',
  }));

  const monthlyRows = await requestCategoryData({
    baseUrl,
    apiKey,
    endpoint: 'monthly-production',
    categories: config.categories,
    bodyBuilder: (category) => ({
      bulan_awal: month,
      bulan_akhir: month,
      tahun: year,
      cabang: config.cabang,
      kategori: category,
    }),
  });

  const dailyRows = await requestCategoryData({
    baseUrl,
    apiKey,
    endpoint: 'daily-production',
    categories: config.categories,
    bodyBuilder: (category) => ({
      tanggal_awal: firstDate,
      tanggal_akhir: today,
      cabang: config.cabang,
      kategori: category,
    }),
  });

  const monthlyTotals = aggregateCategoryTotals(monthlyRows);
  const dailyAggregate = aggregateRows(dailyRows);

  return {
    period: 'monthly',
    tanggal_awal: firstDate,
    tanggal_akhir: today,
    bulan_awal: month,
    bulan_akhir: month,
    tahun: year,
    factory,
    metrics: buildMetrics(factory, monthlyTotals),
    lineData: buildLineData(factory, dailyAggregate.aggregatedByDate, columns),
  };
}

export async function fetchYearlyProduction(factory) {
  const { baseUrl, apiKey } = getBackendConfig();

  const config = FACTORY_CONFIG[factory] || FACTORY_CONFIG.all;
  const today = getTodayDateInJakarta();
  const { year, month } = getYearAndMonth(today);

  const columns = Array.from({ length: month }, (_, idx) => {
    const monthNumber = month - idx;
    const monthKey = `${year}-${String(monthNumber).padStart(2, '0')}`;
    return {
      key: monthKey,
      label: getMonthLabel(monthNumber),
      type: 'month',
    };
  });

  const monthlyRows = await requestCategoryData({
    baseUrl,
    apiKey,
    endpoint: 'monthly-production',
    categories: config.categories,
    bodyBuilder: (category) => ({
      bulan_awal: 1,
      bulan_akhir: month,
      tahun: year,
      cabang: config.cabang,
      kategori: category,
    }),
  });

  const yearlyAggregate = aggregateRowsByMonth(monthlyRows);

  return {
    period: 'yearly',
    bulan_awal: 1,
    bulan_akhir: month,
    tahun: year,
    factory,
    metrics: buildMetrics(factory, yearlyAggregate.totalsByCategory),
    lineData: buildLineData(factory, yearlyAggregate.aggregatedByDate, columns),
  };
}
