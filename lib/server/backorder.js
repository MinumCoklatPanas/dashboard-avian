const LOCATION_BY_PLANT = {
  wotan: ['IPW'],
  cirebon: ['IPC'],
  all: ['IPW', 'IPC'],
};

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

function parseBackOrderNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const raw = String(value || '').trim();
  if (!raw) return 0;

  const normalized = raw.replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeItemNo(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeLocation(value) {
  return String(value || '').trim().toUpperCase();
}

function extractRowLocation(row) {
  return normalizeLocation(
    row?.Branch
      || row?.branch
      || row?.Lokasi
      || row?.lokasi
      || row?.Location
      || row?.location
      || '',
  );
}

function filterRowsByLocation(rows, lokasi, options = {}) {
  const { keepUnknownLocation = false } = options;
  const expectedLocation = normalizeLocation(lokasi);

  return rows.filter((row) => {
    const rowLocation = extractRowLocation(row);
    if (!rowLocation) return keepUnknownLocation;
    return rowLocation === expectedLocation;
  });
}

function normalizeCategory(value) {
  const normalized = String(value || '').trim().toUpperCase().replace(/\s+/g, ' ');
  if (!normalized) return 'UNCATEGORIZED';

  if (normalized.replace(/\s+/g, '') === 'POWERMAX') {
    return 'POWER MAX';
  }

  return normalized;
}

function normalizeLine(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (normalized.includes('pipa')) return 'pipa';
  if (normalized.includes('fitting')) return 'fitting';
  if (normalized.includes('selang')) return 'selang';
  return normalized;
}

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

async function requestBackOrderByLocation({ baseUrl, apiKey, lokasi }) {
  const endpoint = `${baseUrl}/back-order`;
  const timeoutMs = Number.parseInt(process.env.BACKEND_FETCH_TIMEOUT_MS || '15000', 10);
  const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15000)
    : undefined;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    cache: 'no-store',
    body: JSON.stringify({ Lokasi: lokasi }),
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend back-order failed (${response.status}) for lokasi ${lokasi}: ${errorText || response.statusText}`);
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

async function requestRunningMachineByLocation({ baseUrl, apiKey, lokasi }) {
  const endpoint = `${baseUrl}/get-running-machine`;
  const tanggal = getTodayDateInJakarta();
  const timeoutMs = Number.parseInt(process.env.BACKEND_FETCH_TIMEOUT_MS || '15000', 10);
  const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15000)
    : undefined;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    cache: 'no-store',
    body: JSON.stringify({
      Tanggal: tanggal,
      Lokasi: lokasi,
    }),
    ...(signal ? { signal } : {}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend get-running-machine failed (${response.status}) for lokasi ${lokasi}: ${errorText || response.statusText}`);
  }

  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

function mapRunningMachineRow(rawRow, index) {
  const itemNo = String(rawRow?.ItemNo || rawRow?.itemNo || '').trim();
  const machine = String(
    rawRow?.MachineCode
      || rawRow?.machineCode
      || rawRow?.Machine
      || rawRow?.MachineNo
      || rawRow?.MachineName
      || rawRow?.Mesin
      || rawRow?.NoMesin
      || rawRow?.Line
      || `Machine-${index + 1}`,
  ).trim();

  const performanceRaw = rawRow?.Performance ?? rawRow?.performance;
  const performanceNumber = parseBackOrderNumber(performanceRaw);
  const performance = Number.isFinite(performanceNumber) && performanceRaw !== undefined && performanceRaw !== null && String(performanceRaw).trim() !== ''
    ? performanceNumber * 100
    : null;

  return {
    itemNo,
    machine,
    prodTon: parseBackOrderNumber(rawRow?.ProdTon ?? rawRow?.prodTon),
    performance,
    runningItem: String(rawRow?.RunningItem || rawRow?.ItemDesc || rawRow?.runningItem || '').trim() || '-',
  };
}

function buildRunningMachinesByItem(runningRows) {
  const map = new Map();

  runningRows.forEach((rawRow, index) => {
    const row = mapRunningMachineRow(rawRow, index);
    const itemKey = normalizeItemNo(row.itemNo);
    if (!itemKey) return;

    const current = map.get(itemKey) || {
      machines: [],
      totalProdTon: 0,
    };

    current.machines.push(row);
    current.totalProdTon += row.prodTon;
    map.set(itemKey, current);
  });

  return map;
}

function mapBackOrderRow(rawRow, index, fallbackLokasi, runningMachineRef) {
  const branch = String(rawRow?.Branch || '').trim() || fallbackLokasi;
  const itemNo = String(rawRow?.ItemNo || '').trim();
  const itemDesc = String(rawRow?.ItemDesc || '').trim();
  const groupProd = normalizeCategory(rawRow?.GroupProd);
  const prodFam = String(rawRow?.ProdFam || '').trim();
  const sku = String(rawRow?.SKU || '').trim();
  const backOrder = parseBackOrderNumber(rawRow?.BackOrder);
  const totalProdTon = runningMachineRef?.totalProdTon || 0;
  const remainingBoTon = backOrder - totalProdTon;

  return {
    id: `${branch}-${itemNo || 'row'}-${index}`,
    plant: branch,
    itemNo,
    desc: itemDesc,
    category: groupProd,
    line: normalizeLine(prodFam),
    velocity: sku,
    boTon: backOrder,
    remainingBoTon,
    runningProdTon: totalProdTon,
    runningMachines: runningMachineRef?.machines || [],
    rateTon: null,
    hkBo: null,
  };
}

export async function fetchBackOrderData(plant = 'all') {
  const normalizedPlant = String(plant || 'all').toLowerCase();
  const locations = LOCATION_BY_PLANT[normalizedPlant] || LOCATION_BY_PLANT.all;
  const { baseUrl, apiKey } = getBackendConfig();

  const mergedRows = [];

  for (const lokasi of locations) {
    const [rows, runningMachineRows] = await Promise.all([
      requestBackOrderByLocation({ baseUrl, apiKey, lokasi }),
      requestRunningMachineByLocation({ baseUrl, apiKey, lokasi }),
    ]);

    const filteredRows = filterRowsByLocation(rows, lokasi);
    const filteredRunningMachineRows = filterRowsByLocation(runningMachineRows, lokasi, { keepUnknownLocation: true });

    const runningMachinesByItem = buildRunningMachinesByItem(filteredRunningMachineRows);

    filteredRows.forEach((row, index) => {
      const itemKey = normalizeItemNo(row?.ItemNo);
      const runningMachineRef = runningMachinesByItem.get(itemKey);
      mergedRows.push(mapBackOrderRow(row, index, lokasi, runningMachineRef));
    });
  }

  return {
    plant: normalizedPlant,
    locations,
    items: mergedRows,
  };
}
