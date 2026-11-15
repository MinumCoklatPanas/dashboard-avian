export const periodLabel = {
  daily: 'Harian',
  weekly: 'Mingguan (H-7)',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export const periodDescription = {
  daily: '19 Ags 2026',
  weekly: '13 Ags 2026 - 19 Ags 2026',
  monthly: 'Agustus 2026',
  yearly: 'YTD 2026 (data tersedia sampai Agustus)',
};

const augustDates = [
  '2026-08-19', '2026-08-18', '2026-08-17', '2026-08-16', '2026-08-15',
  '2026-08-14', '2026-08-13', '2026-08-12', '2026-08-11', '2026-08-10',
  '2026-08-09', '2026-08-08', '2026-08-07', '2026-08-06', '2026-08-05',
  '2026-08-04', '2026-08-03', '2026-08-02', '2026-08-01',
];

const ytdMonths = [
  { key: '2026-01', label: 'Jan', days: 31 },
  { key: '2026-02', label: 'Feb', days: 28 },
  { key: '2026-03', label: 'Mar', days: 31 },
  { key: '2026-04', label: 'Apr', days: 30 },
  { key: '2026-05', label: 'Mei', days: 31 },
  { key: '2026-06', label: 'Jun', days: 30 },
  { key: '2026-07', label: 'Jul', days: 31 },
  { key: '2026-08', label: 'Agu', days: 31 },
];

const wotanTargets = {
  default: { power: 35.53, power_max: 24.49, quad: 60.0, fitting_power: 15.0, fitting_quad: 12.0 },
};

const cirebonTargets = {
  default: { power: 32.0, power_max: 22.0, quad: 50.0, fitting_power: 13.0, fitting_quad: 10.0, selang: 18.0 },
};

const wotanActuals = {
  '2026-08-19': { power: 33.1, power_max: 21.8, quad: 57.5, fitting_power: 13.8, fitting_quad: 11.2 },
  '2026-08-18': { power: 32.8, power_max: 22.4, quad: 56.9, fitting_power: 14.1, fitting_quad: 10.8 },
  '2026-08-17': { power: 34.0, power_max: 23.1, quad: 59.2, fitting_power: 14.5, fitting_quad: 12.1 },
  '2026-08-16': { power: 31.9, power_max: 20.6, quad: 55.4, fitting_power: 12.9, fitting_quad: 10.4 },
  '2026-08-15': { power: 32.2, power_max: 21.0, quad: 56.1, fitting_power: 13.2, fitting_quad: 10.9 },
  '2026-08-14': { power: 32.5, power_max: 22.1, quad: 58.2, fitting_power: 13.5, fitting_quad: 9.8 },
  '2026-08-13': { power: 31.2, power_max: 19.5, quad: 54.1, fitting_power: 12.8, fitting_quad: 10.2 },
  '2026-08-12': { power: 33.6, power_max: 23.4, quad: 57.8, fitting_power: 14.2, fitting_quad: 11.5 },
  '2026-08-11': { power: 32.34, power_max: 14.94, quad: 38.74, fitting_power: 11.4, fitting_quad: 8.4 },
  '2026-08-10': { power: 28.4, power_max: 25.56, quad: 75.0, fitting_power: 15.8, fitting_quad: 13.2 },
  '2026-08-09': { power: 18.5, power_max: 16.2, quad: 35.2, fitting_power: 10.5, fitting_quad: 7.5 },
  '2026-08-08': { power: 15.2, power_max: 15.8, quad: 32.5, fitting_power: 9.8, fitting_quad: 6.8 },
  '2026-08-07': { power: 20.4, power_max: 14.3, quad: 28.9, fitting_power: 8.5, fitting_quad: 7.2 },
  '2026-08-06': { power: 22.1, power_max: 13.9, quad: 33.4, fitting_power: 9.2, fitting_quad: 8.1 },
  '2026-08-05': { power: 24.6, power_max: 17.2, quad: 38.6, fitting_power: 12.4, fitting_quad: 9.5 },
  '2026-08-04': { power: 19.8, power_max: 15.5, quad: 31.2, fitting_power: 10.6, fitting_quad: 8.3 },
  '2026-08-03': { power: 21.3, power_max: 12.8, quad: 32.8, fitting_power: 11.2, fitting_quad: 8.6 },
  '2026-08-02': { power: 20.52, power_max: 14.98, quad: 30.64, fitting_power: 10.8, fitting_quad: 8.0 },
  '2026-08-01': { power: 22.4, power_max: 13.9, quad: 34.2, fitting_power: 11.5, fitting_quad: 7.8 },
};

const cirebonActuals = {
  '2026-08-19': { power: 29.8, power_max: 20.2, quad: 48.5, fitting_power: 11.5, fitting_quad: 9.1, selang: 15.5 },
  '2026-08-18': { power: 29.5, power_max: 20.9, quad: 47.8, fitting_power: 12.0, fitting_quad: 8.8, selang: 14.9 },
  '2026-08-17': { power: 31.0, power_max: 21.5, quad: 50.2, fitting_power: 12.5, fitting_quad: 9.8, selang: 16.2 },
  '2026-08-16': { power: 28.9, power_max: 19.2, quad: 46.1, fitting_power: 11.1, fitting_quad: 8.2, selang: 14.0 },
  '2026-08-15': { power: 29.1, power_max: 19.8, quad: 46.8, fitting_power: 11.4, fitting_quad: 8.7, selang: 14.5 },
  '2026-08-14': { power: 29.4, power_max: 20.5, quad: 48.2, fitting_power: 11.8, fitting_quad: 8.0, selang: 15.0 },
  '2026-08-13': { power: 28.5, power_max: 18.2, quad: 45.1, fitting_power: 11.2, fitting_quad: 8.5, selang: 13.8 },
  '2026-08-12': { power: 30.2, power_max: 21.8, quad: 49.5, fitting_power: 12.4, fitting_quad: 9.8, selang: 15.2 },
  '2026-08-11': { power: 29.8, power_max: 13.9, quad: 32.5, fitting_power: 9.8, fitting_quad: 7.2, selang: 11.2 },
  '2026-08-10': { power: 26.5, power_max: 23.2, quad: 62.5, fitting_power: 13.9, fitting_quad: 11.0, selang: 16.8 },
  '2026-08-09': { power: 17.2, power_max: 15.0, quad: 30.5, fitting_power: 9.2, fitting_quad: 6.5, selang: 10.5 },
  '2026-08-08': { power: 14.0, power_max: 14.8, quad: 28.2, fitting_power: 8.5, fitting_quad: 5.9, selang: 9.8 },
  '2026-08-07': { power: 18.9, power_max: 13.2, quad: 25.1, fitting_power: 7.2, fitting_quad: 6.1, selang: 11.5 },
  '2026-08-06': { power: 20.2, power_max: 12.8, quad: 29.2, fitting_power: 7.9, fitting_quad: 6.9, selang: 12.2 },
  '2026-08-05': { power: 22.8, power_max: 15.9, quad: 33.9, fitting_power: 10.9, fitting_quad: 8.1, selang: 14.0 },
  '2026-08-04': { power: 18.2, power_max: 14.2, quad: 27.5, fitting_power: 9.1, fitting_quad: 7.0, selang: 10.8 },
  '2026-08-03': { power: 19.5, power_max: 11.9, quad: 28.8, fitting_power: 9.7, fitting_quad: 7.2, selang: 11.2 },
  '2026-08-02': { power: 18.9, power_max: 13.9, quad: 26.8, fitting_power: 9.4, fitting_quad: 6.8, selang: 10.9 },
  '2026-08-01': { power: 20.5, power_max: 12.8, quad: 30.2, fitting_power: 10.1, fitting_quad: 6.5, selang: 12.0 },
};

function getDeterministicValue(seedStr, min, max) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const val = Math.abs(hash % 1000) / 1000;
  return min + val * (max - min);
}

function getPeriodDates(period) {
  if (period === 'daily') return [augustDates[0]];
  if (period === 'weekly') return augustDates.slice(0, 7);
  return [...augustDates];
}

function sumByDates(dates, source, keys) {
  return dates.reduce((acc, date) => {
    const row = source[date] || {};
    keys.forEach((key) => {
      acc[key] = (acc[key] || 0) + (row[key] || 0);
    });
    return acc;
  }, {});
}

function buildFactoryMetrics(factory, period) {
  const dates = getPeriodDates(period);
  const daysCount = dates.length || 1;

  const wActual = sumByDates(dates, wotanActuals, ['power', 'power_max', 'quad', 'fitting_power', 'fitting_quad']);
  const cActual = sumByDates(dates, cirebonActuals, ['power', 'power_max', 'quad', 'fitting_power', 'fitting_quad', 'selang']);

  const wTargetPerDay = wotanTargets.default;
  const cTargetPerDay = cirebonTargets.default;
  const wTarget = {
    power: wTargetPerDay.power * daysCount,
    power_max: wTargetPerDay.power_max * daysCount,
    quad: wTargetPerDay.quad * daysCount,
    fitting_power: wTargetPerDay.fitting_power * daysCount,
    fitting_quad: wTargetPerDay.fitting_quad * daysCount,
  };
  const cTarget = {
    power: cTargetPerDay.power * daysCount,
    power_max: cTargetPerDay.power_max * daysCount,
    quad: cTargetPerDay.quad * daysCount,
    fitting_power: cTargetPerDay.fitting_power * daysCount,
    fitting_quad: cTargetPerDay.fitting_quad * daysCount,
    selang: cTargetPerDay.selang * daysCount,
  };

  const card = (title, targetTon, actualTon, color) => {
    const pct = targetTon > 0 ? (actualTon / targetTon) * 100 : 0;
    const gap = actualTon - targetTon;
    return {
      title,
      target: `${Math.round(targetTon).toLocaleString('id-ID')} Ton`,
      actual: `${Math.round(actualTon).toLocaleString('id-ID')} Ton`,
      pct: `${pct.toFixed(1)}%`,
      gap: `${gap >= 0 ? '+' : ''}${Math.round(gap).toLocaleString('id-ID')} Ton`,
      color,
    };
  };

  const wPipaTarget = wTarget.power + wTarget.power_max + wTarget.quad;
  const wPipaActual = (wActual.power || 0) + (wActual.power_max || 0) + (wActual.quad || 0);
  const wFitTarget = wTarget.fitting_power + wTarget.fitting_quad;
  const wFitActual = (wActual.fitting_power || 0) + (wActual.fitting_quad || 0);

  const cPipaTarget = cTarget.power + cTarget.power_max + cTarget.quad;
  const cPipaActual = (cActual.power || 0) + (cActual.power_max || 0) + (cActual.quad || 0);
  const cFitTarget = cTarget.fitting_power + cTarget.fitting_quad;
  const cFitActual = (cActual.fitting_power || 0) + (cActual.fitting_quad || 0);
  const cSelTarget = cTarget.selang;
  const cSelActual = cActual.selang || 0;

  const allPipaTarget = wPipaTarget + cPipaTarget;
  const allPipaActual = wPipaActual + cPipaActual;
  const allFitTarget = wFitTarget + cFitTarget;
  const allFitActual = wFitActual + cFitActual;
  const allSelTarget = cSelTarget;
  const allSelActual = cSelActual;

  const bundle = {
    all: {
      kpi: {
        target: `${Math.round(allPipaTarget + allFitTarget + allSelTarget).toLocaleString('id-ID')} Ton`,
        actual: `${Math.round(allPipaActual + allFitActual + allSelActual).toLocaleString('id-ID')} Ton`,
        achievement: `${(((allPipaActual + allFitActual + allSelActual) / (allPipaTarget + allFitTarget + allSelTarget)) * 100).toFixed(1)}%`,
      },
      cards: [
        card('Hasil Produksi Pipa', allPipaTarget, allPipaActual, 'primary'),
        card('Hasil Produksi Fitting', allFitTarget, allFitActual, 'secondary'),
        card('Hasil Produksi Selang', allSelTarget, allSelActual, 'tertiary'),
      ],
    },
    wotan: {
      kpi: {
        target: `${Math.round(wPipaTarget + wFitTarget).toLocaleString('id-ID')} Ton`,
        actual: `${Math.round(wPipaActual + wFitActual).toLocaleString('id-ID')} Ton`,
        achievement: `${(((wPipaActual + wFitActual) / (wPipaTarget + wFitTarget)) * 100).toFixed(1)}%`,
      },
      cards: [
        card('Hasil Produksi Pipa', wPipaTarget, wPipaActual, 'primary'),
        card('Hasil Produksi Fitting', wFitTarget, wFitActual, 'secondary'),
      ],
    },
    cirebon: {
      kpi: {
        target: `${Math.round(cPipaTarget + cFitTarget + cSelTarget).toLocaleString('id-ID')} Ton`,
        actual: `${Math.round(cPipaActual + cFitActual + cSelActual).toLocaleString('id-ID')} Ton`,
        achievement: `${(((cPipaActual + cFitActual + cSelActual) / (cPipaTarget + cFitTarget + cSelTarget)) * 100).toFixed(1)}%`,
      },
      cards: [
        card('Hasil Produksi Pipa', cPipaTarget, cPipaActual, 'primary'),
        card('Hasil Produksi Fitting', cFitTarget, cFitActual, 'secondary'),
        card('Hasil Produksi Selang', cSelTarget, cSelActual, 'tertiary'),
      ],
    },
  };

  return bundle[factory];
}

function buildMachineLogs() {
  const wotanExtruders = Array.from({ length: 35 }, (_, idx) => {
    const n = idx + 1;
    return { code: `E${String(n).padStart(2, '0')}`, name: `Extruder E${String(n).padStart(2, '0')}`, type: 'Extruder' };
  });
  const wotanInjections = Array.from({ length: 38 }, (_, idx) => {
    const n = idx + 1;
    return { code: `I${String(n).padStart(2, '0')}`, name: `Injection I${String(n).padStart(2, '0')}`, type: 'Injection' };
  });
  const cirebonExtruders = Array.from({ length: 16 }, (_, idx) => {
    const n = idx + 21;
    return { code: `E${n}`, name: `Extruder E${n}`, type: 'Extruder' };
  });
  const cirebonInjections = Array.from({ length: 9 }, (_, idx) => {
    const n = idx + 1;
    return { code: `I0${n}`, name: `Injection I0${n}`, type: 'Injection' };
  });
  const hose = Array.from({ length: 3 }, (_, idx) => {
    const n = idx + 1;
    return { code: `S0${n}`, name: `Selang Maker S0${n}`, type: 'Selang' };
  });

  const wotanMachines = [...wotanExtruders, ...wotanInjections];
  const cirebonMachines = [...cirebonExtruders, ...cirebonInjections, ...hose];
  const wotanLogs = {};
  const cirebonLogs = {};

  const baseLog = (machine, date) => {
    const key = `${machine.code}-${date}`;
    const targetSPK = machine.type === 'Extruder'
      ? Number(getDeterministicValue(`${key}-target`, 8, 15).toFixed(1))
      : Number(getDeterministicValue(`${key}-target`, 2, 5).toFixed(1));
    const actualPct = getDeterministicValue(`${key}-actual`, 0.82, 0.98);
    return {
      code: machine.code,
      name: machine.name,
      type: machine.type,
      status: 'Running',
      targetSPK,
      actualOutput: Number((targetSPK * actualPct).toFixed(2)),
      actualOutputPct: actualPct * 100,
      reworkPcs: Math.round(getDeterministicValue(`${key}-rework`, 10, 50)),
      rejectPcs: Math.round(getDeterministicValue(`${key}-reject`, 5, 25)),
      wasteKg: Math.round(getDeterministicValue(`${key}-waste`, 10, 80)),
      wasteRunnerKg: machine.type === 'Injection' ? Math.round(getDeterministicValue(`${key}-runner`, 5, 30)) : 0,
    };
  };

  augustDates.forEach((date) => {
    wotanLogs[date] = wotanMachines.map((m) => baseLog(m, date));
    cirebonLogs[date] = cirebonMachines.map((m) => baseLog(m, date));
  });

  const stopLog = (log) => {
    log.actualOutput = 0;
    log.actualOutputPct = 0;
    log.reworkPcs = 0;
    log.rejectPcs = 0;
    log.wasteKg = 0;
    log.wasteRunnerKg = 0;
  };

  const setRange = (db, code, startDay, endDay, status) => {
    for (let day = startDay; day <= endDay; day++) {
      const date = `2026-08-${String(day).padStart(2, '0')}`;
      const row = (db[date] || []).find((m) => m.code === code);
      if (row) {
        row.status = status;
        if (status !== 'Running' && status !== 'Chrome') stopLog(row);
      }
    }
  };

  // Historical downtime windows in legacy data.
  [['E22', 10, 14, 'Repair External'], ['E28', 11, 12, 'Repair Internal'], ['I03', 11, 14, 'Repair External']].forEach(
    ([code, s, e, st]) => setRange(wotanLogs, code, s, e, st),
  );
  [['E31', 8, 14, 'Repair External'], ['E23', 10, 11, 'Repair Internal'], ['I05', 12, 14, 'Repair Internal']].forEach(
    ([code, s, e, st]) => setRange(cirebonLogs, code, s, e, st),
  );

  [['E22', 17, 19, 'Repair External'], ['E24', 18, 19, 'Overhaul'], ['E25', 19, 19, 'No Order'], ['E26', 19, 19, 'No Active'], ['E27', 16, 19, 'Chrome'], ['E28', 17, 19, 'Repair Internal'], ['I01', 19, 19, 'Repair Internal'], ['I02', 19, 19, 'Repair External']].forEach(
    ([code, s, e, st]) => setRange(wotanLogs, code, s, e, st),
  );
  [['E31', 15, 19, 'Repair External'], ['E32', 18, 19, 'Overhaul'], ['E33', 19, 19, 'No Order'], ['E34', 19, 19, 'No Active'], ['E35', 16, 19, 'Chrome'], ['E23', 17, 19, 'Repair Internal'], ['I04', 19, 19, 'Repair Internal'], ['I05', 19, 19, 'Repair External']].forEach(
    ([code, s, e, st]) => setRange(cirebonLogs, code, s, e, st),
  );

  return { wotanMachines, cirebonMachines, wotanLogs, cirebonLogs };
}

const legacyMachineDb = buildMachineLogs();

export function getHasilProduksiMetrics(factory, period) {
  return buildFactoryMetrics(factory, period);
}

export function getMachineData(factory, period) {
  const dates = getPeriodDates(period);
  const sources =
    factory === 'all'
      ? [
          { plant: 'Wotan', machines: legacyMachineDb.wotanMachines, logs: legacyMachineDb.wotanLogs },
          { plant: 'Cirebon', machines: legacyMachineDb.cirebonMachines, logs: legacyMachineDb.cirebonLogs },
        ]
      : factory === 'wotan'
        ? [{ plant: 'Wotan', machines: legacyMachineDb.wotanMachines, logs: legacyMachineDb.wotanLogs }]
        : [{ plant: 'Cirebon', machines: legacyMachineDb.cirebonMachines, logs: legacyMachineDb.cirebonLogs }];

  const details = [];
  sources.forEach(({ plant, machines, logs }) => {
    machines.forEach((machine) => {
      let target = 0;
      let actual = 0;
      let reworkKg = 0;
      let rejectKg = 0;
      let wasteKg = 0;
      let wasteRunnerKg = 0;
      dates.forEach((date) => {
        const row = (logs[date] || []).find((m) => m.code === machine.code);
        if (row) {
          target += row.targetSPK || 0;
          actual += row.actualOutput || 0;
          reworkKg += row.reworkPcs || 0;
          rejectKg += row.rejectPcs || 0;
          wasteKg += row.wasteKg || 0;
          wasteRunnerKg += row.wasteRunnerKg || 0;
        }
      });
      const latestLog = (logs[dates[0]] || []).find((m) => m.code === machine.code) || {};
      const totalLossKg = reworkKg + rejectKg + wasteKg + wasteRunnerKg;
      const outputGoodTon = Math.max(actual - (totalLossKg / 1000), 0);
      details.push({
        plant,
        code: machine.code,
        name: machine.name,
        status: latestLog.status || 'No Active',
        target: `${Math.round(target).toLocaleString('id-ID')} Ton`,
        actual: `${Math.round(actual).toLocaleString('id-ID')} Ton`,
        outputGood: `${outputGoodTon.toFixed(2)} Ton`,
        waste: `${Math.round(wasteKg).toLocaleString('id-ID')} Kg`,
        wasteRunner: `${Math.round(wasteRunnerKg).toLocaleString('id-ID')} Kg`,
        reject: `${Math.round(rejectKg).toLocaleString('id-ID')} Kg`,
        rework: `${Math.round(reworkKg).toLocaleString('id-ID')} Kg`,
        totalLossPct: `${(actual > 0 ? ((totalLossKg / 1000) / actual) * 100 : 0).toFixed(1)}%`,
        performance: `${(target > 0 ? (actual / target) * 100 : 0).toFixed(1)}%`,
        performanceValue: target > 0 ? (actual / target) * 100 : 0,
        type: machine.type,
      });
    });
  });

  let summary;
  if (factory === 'all') {
    const under60 = details.filter((m) => m.performanceValue < 60).length;
    const between = details.filter((m) => m.performanceValue >= 60 && m.performanceValue < 80).length;
    const over80 = details.filter((m) => m.performanceValue >= 80).length;
    summary = [
      { label: 'Performance < 60%', value: `${under60} mesin` },
      { label: 'Performance 60–80%', value: `${between} mesin` },
      { label: 'Performance ≥ 80%', value: `${over80} mesin` },
    ];
  } else if (factory === 'wotan') {
    const running = details.filter((m) => m.status === 'Running').length;
    const avg = details.reduce((sum, m) => sum + m.performanceValue, 0) / (details.length || 1);
    summary = [
      { label: 'Extruder', value: `${details.filter((m) => m.type === 'Extruder').length}` },
      { label: 'Injection', value: `${details.filter((m) => m.type === 'Injection').length}` },
      { label: 'Running / Avg Performance', value: `${running} / ${avg.toFixed(1)}%` },
    ];
  } else {
    const running = details.filter((m) => m.status === 'Running').length;
    const avg = details.reduce((sum, m) => sum + m.performanceValue, 0) / (details.length || 1);
    summary = [
      { label: 'Extruder', value: `${details.filter((m) => m.type === 'Extruder').length}` },
      { label: 'Injection + Selang', value: `${details.filter((m) => m.type !== 'Extruder').length}` },
      { label: 'Running / Avg Performance', value: `${running} / ${avg.toFixed(1)}%` },
    ];
  }

  return { summary, details };
}

export function getHarianProduksiData(factory, period) {
  const isYearly = period === 'yearly';
  const dates = getPeriodDates(period);

  const getTargetPerDay = (type, sourceFactory) => {
    const wTarget = wotanTargets.default;
    const cTarget = cirebonTargets.default;

    const sumKeys = (obj, keys) => keys.reduce((acc, key) => acc + (obj[key] || 0), 0);

    if (sourceFactory === 'wotan') {
      if (type === 'pipa') return sumKeys(wTarget, ['power', 'power_max', 'quad']);
      if (type === 'fitting') return sumKeys(wTarget, ['fitting_power', 'fitting_quad']);
      return 0;
    }

    if (sourceFactory === 'cirebon') {
      if (type === 'pipa') return sumKeys(cTarget, ['power', 'power_max', 'quad']);
      if (type === 'fitting') return sumKeys(cTarget, ['fitting_power', 'fitting_quad']);
      if (type === 'selang') return cTarget.selang || 0;
      return 0;
    }

    if (type === 'pipa') {
      return sumKeys(wTarget, ['power', 'power_max', 'quad']) + sumKeys(cTarget, ['power', 'power_max', 'quad']);
    }
    if (type === 'fitting') {
      return sumKeys(wTarget, ['fitting_power', 'fitting_quad']) + sumKeys(cTarget, ['fitting_power', 'fitting_quad']);
    }
    if (type === 'selang') {
      return cTarget.selang || 0;
    }

    return 0;
  };

  const buildYearlyRows = (type, sourceFactory) => {
    const basePerDay = getTargetPerDay(type, sourceFactory);

    return ytdMonths.map((month) => {
      const targetFactor = getDeterministicValue(`${sourceFactory}-${type}-${month.key}-target`, 0.96, 1.08);
      const actualFactor = getDeterministicValue(`${sourceFactory}-${type}-${month.key}-actual`, 0.82, 1.12);
      const target = Number((basePerDay * month.days * targetFactor).toFixed(2));
      const actual = Number((target * actualFactor).toFixed(2));
      const pct = target > 0 ? (actual / target) * 100 : 0;

      return {
        date: month.key,
        dateLabel: month.label,
        target,
        actual,
        pct,
        met: actual >= target,
      };
    });
  };

  const buildDailyRows = (type, sourceFactory) => {
    return dates.map((date) => {
      const wTarget = wotanTargets.default;
      const cTarget = cirebonTargets.default;
      const wActual = wotanActuals[date] || {};
      const cActual = cirebonActuals[date] || {};

      let target = 0;
      let actual = 0;

      const addValues = (keyList, fromTarget, fromActual) => {
        keyList.forEach((key) => {
          target += fromTarget[key] || 0;
          actual += fromActual[key] || 0;
        });
      };

      if (sourceFactory === 'wotan') {
        if (type === 'pipa') addValues(['power', 'power_max', 'quad'], wTarget, wActual);
        if (type === 'fitting') addValues(['fitting_power', 'fitting_quad'], wTarget, wActual);
      } else if (sourceFactory === 'cirebon') {
        if (type === 'pipa') addValues(['power', 'power_max', 'quad'], cTarget, cActual);
        if (type === 'fitting') addValues(['fitting_power', 'fitting_quad'], cTarget, cActual);
        if (type === 'selang') addValues(['selang'], cTarget, cActual);
      } else {
        if (type === 'pipa') {
          addValues(['power', 'power_max', 'quad'], wTarget, wActual);
          addValues(['power', 'power_max', 'quad'], cTarget, cActual);
        }
        if (type === 'fitting') {
          addValues(['fitting_power', 'fitting_quad'], wTarget, wActual);
          addValues(['fitting_power', 'fitting_quad'], cTarget, cActual);
        }
        if (type === 'selang') {
          addValues(['selang'], cTarget, cActual);
        }
      }

      const pct = target > 0 ? (actual / target) * 100 : 0;
      return {
        date,
        dateLabel: `${parseInt(date.split('-')[2], 10)} Ags`,
        target,
        actual,
        pct,
        met: actual >= target,
      };
    });
  };

  const buildRows = isYearly ? buildYearlyRows : buildDailyRows;

  const src = factory === 'all' ? 'all' : factory;
  return {
    pipa: buildRows('pipa', src),
    fitting: buildRows('fitting', src),
    selang: factory === 'wotan' ? [] : buildRows('selang', src),
  };
}
