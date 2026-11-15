export type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type FactoryKey = 'all' | 'wotan' | 'cirebon';

export const periodLabel: Record<PeriodKey, string> = {
  daily: 'Harian',
  weekly: 'Mingguan (H-7)',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export const periodDescription: Record<PeriodKey, string> = {
  daily: '19 Ags 2026',
  weekly: '13 Ags 2026 - 19 Ags 2026',
  monthly: 'Agustus 2026',
  yearly: 'YTD 2026 (data tersedia sampai Agustus)',
};

export const hasilProduksiKpi = {
  all: {
    target: '2.044 Ton',
    actual: '1.872 Ton',
    achievement: '91.6%',
  },
  wotan: {
    target: '2.058 Ton',
    actual: '1.401 Ton',
    achievement: '68.1%',
  },
  cirebon: {
    target: '2.268 Ton',
    actual: '1.612 Ton',
    achievement: '71.1%',
  },
};

export const hasilProduksiCards = {
  all: [
    { title: 'Hasil Produksi Pipa', target: '1.568 Ton', actual: '1.455 Ton', pct: '92.8%', gap: '-113 Ton', color: 'primary' },
    { title: 'Hasil Produksi Fitting', target: '350 Ton', actual: '313 Ton', pct: '89.4%', gap: '-37 Ton', color: 'secondary' },
    { title: 'Hasil Produksi Selang', target: '126 Ton', actual: '104 Ton', pct: '82.5%', gap: '-22 Ton', color: 'tertiary' },
  ],
  wotan: [
    { title: 'Hasil Produksi Pipa', target: '1.680 Ton', actual: '1.135 Ton', pct: '67.6%', gap: '-545 Ton', color: 'primary' },
    { title: 'Hasil Produksi Fitting', target: '378 Ton', actual: '266 Ton', pct: '70.3%', gap: '-112 Ton', color: 'secondary' },
  ],
  cirebon: [
    { title: 'Hasil Produksi Pipa', target: '1.610 Ton', actual: '1.159 Ton', pct: '72.0%', gap: '-451 Ton', color: 'primary' },
    { title: 'Hasil Produksi Fitting', target: '378 Ton', actual: '252 Ton', pct: '66.7%', gap: '-126 Ton', color: 'secondary' },
    { title: 'Hasil Produksi Selang', target: '280 Ton', actual: '200 Ton', pct: '71.6%', gap: '-80 Ton', color: 'tertiary' },
  ],
};

export const machineSummary = {
  all: [
    { label: 'Total Mesin', value: '101' },
    { label: 'Running', value: '68' },
    { label: 'Avg Performance', value: '89.7%' },
  ],
  wotan: [
    { label: 'Extruder', value: '35' },
    { label: 'Injection', value: '38' },
    { label: 'Avg Performance', value: '88.9%' },
  ],
  cirebon: [
    { label: 'Extruder', value: '16' },
    { label: 'Injection + Selang', value: '12' },
    { label: 'Avg Performance', value: '90.1%' },
  ],
};

export const machineDetailRows = [
  { plant: 'Wotan', name: 'Extruder E01', status: 'Running', target: '120 Ton', actual: '108 Ton', performance: '90.0%' },
  { plant: 'Wotan', name: 'Injection I04', status: 'Running', target: '25 Ton', actual: '21 Ton', performance: '84.0%' },
  { plant: 'Cirebon', name: 'Extruder E24', status: 'Repair', target: '98 Ton', actual: '61 Ton', performance: '62.2%' },
  { plant: 'Cirebon', name: 'Selang S01', status: 'Running', target: '20 Ton', actual: '17 Ton', performance: '85.0%' },
];
