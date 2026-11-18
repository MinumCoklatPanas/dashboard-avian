'use client';

import { useEffect, useMemo, useState } from 'react';
import { getHasilProduksiMetrics, getMachineData, getHarianProduksiLineData, periodLabel, periodDescription } from '../../lib/data/hasilProduksi';

export default function HasilProduksiPage({ produksiSubmenu = 'hasil_produksi', onChangeProduksiSubmenu }) {
  const [period, setPeriod] = useState('monthly');
  const [factory, setFactory] = useState('all');
  const [openGroups, setOpenGroups] = useState({});
  const [openHasilSections, setOpenHasilSections] = useState({ pipa: true });
  const [dailyApiData, setDailyApiData] = useState(null);
  const [dailyApiLoading, setDailyApiLoading] = useState(false);
  const [dailyApiError, setDailyApiError] = useState('');

  const isHasil = produksiSubmenu === 'hasil_produksi';
  const isPerforma = produksiSubmenu === 'performa_mesin';

  useEffect(() => {
    if (isPerforma && factory === 'all') {
      setFactory('wotan');
    }
  }, [isPerforma, factory]);

  const metrics = useMemo(() => getHasilProduksiMetrics(factory, period), [factory, period]);
  const machineData = useMemo(() => getMachineData(factory, 'monthly'), [factory]);
  const harianLineData = useMemo(() => getHarianProduksiLineData(factory, period), [factory, period]);
  const isYearly = period === 'yearly';
  const isBackendPeriodMode = isHasil && (period === 'daily' || period === 'weekly');

  useEffect(() => {
    if (!isBackendPeriodMode) {
      setDailyApiData(null);
      setDailyApiError('');
      setDailyApiLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchDailyData = async () => {
      try {
        setDailyApiLoading(true);
        setDailyApiError('');
        const response = await fetch(`/api/hasil-produksi/${period}?factory=${factory}`, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          const failed = await response.json().catch(() => null);
          throw new Error(failed?.error || failed?.message || 'Gagal mengambil data harian produksi.');
        }

        const payload = await response.json();
        setDailyApiData(payload);
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setDailyApiData(null);
        setDailyApiError(error instanceof Error ? error.message : 'Gagal mengambil data harian produksi.');
      } finally {
        if (!controller.signal.aborted) {
          setDailyApiLoading(false);
        }
      }
    };

    fetchDailyData();
    return () => controller.abort();
  }, [factory, isBackendPeriodMode, period]);

  const activeMetrics = isBackendPeriodMode && dailyApiData?.metrics ? dailyApiData.metrics : metrics;
  const cards = activeMetrics.cards;
  const kpi = activeMetrics.kpi;
  const activeHarianLineData = isBackendPeriodMode && dailyApiData?.lineData ? dailyApiData.lineData : harianLineData;
  const formatTon = (value) => Number(value || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const performaCards = useMemo(() => {
    const typeOrder = ['Extruder', 'Injection', 'Selang'];
    const statusOrder = ['Running', 'Overhaul', 'Repair Internal', 'Repair External', 'No Order', 'No Active', 'Chrome'];

    const typeMeta = {
      Extruder: {
        title: 'EXTRUSION',
        icon: 'precision_manufacturing',
        statusLabel: 'STATUS DICE',
      },
      Injection: {
        title: 'INJECTION',
        icon: 'grid_view',
        statusLabel: 'STATUS MOULD',
      },
      Selang: {
        title: 'SELANG',
        icon: 'water',
        statusLabel: 'STATUS LINE',
      },
    };

    const grouped = typeOrder
      .map((type) => {
        const items = machineData.details.filter((row) => row.type === type);
        if (!items.length) return null;

        const statusCounts = statusOrder.reduce((acc, key) => {
          acc[key] = items.filter((m) => m.status === key).length;
          return acc;
        }, {});

        const perfLt60 = items.filter((m) => m.performanceValue < 60).length;
        const perf60to80 = items.filter((m) => m.performanceValue >= 60 && m.performanceValue < 80).length;
        const perfGe80 = items.filter((m) => m.performanceValue >= 80).length;

        return {
          ...typeMeta[type],
          type,
          total: items.length,
          statusCounts,
          perfLt60,
          perf60to80,
          perfGe80,
        };
      })
      .filter(Boolean);

    return grouped;
  }, [machineData.details]);

  const groupedMachineDetails = useMemo(() => {
    const byType = {
      Extruder: machineData.details.filter((m) => m.type === 'Extruder'),
      Injection: machineData.details.filter((m) => m.type === 'Injection'),
      Selang: machineData.details.filter((m) => m.type === 'Selang'),
    };

    return [
      { type: 'Extruder', title: 'Rincian Mesin Extruder', icon: 'precision_manufacturing', rows: byType.Extruder },
      { type: 'Injection', title: 'Rincian Mesin Injection', icon: 'grid_view', rows: byType.Injection },
      { type: 'Selang', title: 'Rincian Mesin Selang', icon: 'water', rows: byType.Selang },
    ].filter((g) => g.rows.length > 0);
  }, [machineData.details]);

  const isGroupOpen = (type) => openGroups[type] !== false;

  const toggleGroup = (type) => {
    setOpenGroups((prev) => ({
      ...prev,
      [type]: prev[type] === false,
    }));
  };

  const isHasilSectionOpen = (section) => openHasilSections[section] === true;

  const toggleHasilSection = (section) => {
    setOpenHasilSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <section id="panel-hasil_produksi" className="panel-transition space-y-gutter-lg">
      <div className="pb-3 border-b border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-headline-lg text-2xl lg:text-3xl font-black text-on-surface tracking-tight">{isHasil ? 'Hasil Produksi Pabrik' : 'Performa Mesin Pabrik'}</h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60 shadow-inner">
            <button
              onClick={() => onChangeProduksiSubmenu?.('hasil_produksi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-label-mono shadow-sm transition-all ${isHasil ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
            >
              <span className="material-symbols-outlined text-sm">analytics</span>
              <span>Hasil Produksi</span>
            </button>
            <button
              onClick={() => onChangeProduksiSubmenu?.('performa_mesin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-label-mono transition-all ${isPerforma ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
            >
              <span className="material-symbols-outlined text-sm">speed</span>
              <span>Performa Mesin</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant font-medium mt-1">
          {isHasil ? 'Monitoring realisasi produksi dan target output pabrik' : 'Monitoring efektivitas operasional, OEE, dan rincian performa per mesin'}
        </p>
      </div>

      <div className="relative sm:sticky sm:top-[106px] z-30 bg-surface/95 backdrop-blur-md py-2.5 px-3 sm:px-4 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant mr-1">
            <span className="material-symbols-outlined text-primary text-base">calendar_month</span>
            <span>Periode:</span>
          </div>
          {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-label-mono transition-all active:scale-95 ${
                period === p ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {periodLabel[p]}
            </button>
          ))}
          <span className="ml-1 w-full sm:w-auto text-[13px] sm:text-[14px] font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md border border-outline-variant/40">
            {periodLabel[period]}: {periodDescription[period]}
          </span>
        </div>

        <div className="w-full sm:w-auto overflow-x-auto custom-scrollbar">
          <div className="inline-flex items-center gap-1.5 bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 shadow-sm shrink-0 min-w-max">
          {[
            { id: 'wotan', label: 'AAIP Wotan', sub: 'Pipa & Fitting', icon: 'factory' },
            { id: 'cirebon', label: 'AAIP Cirebon', sub: 'Pipa, Fitting & Selang', icon: 'domain' },
            { id: 'all', label: 'Semua Pabrik', sub: 'Wotan & Cirebon', icon: 'domain' },
          ].filter((item) => !(isPerforma && item.id === 'all')).map((item) => (
            <button
              key={item.id}
              onClick={() => setFactory(item.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold font-label-mono transition-all duration-200 ${
                factory === item.id ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <div className="text-left">
                <span className="block leading-tight font-black">{item.label}</span>
                <span className="block text-[9px] opacity-80 font-normal">{item.sub}</span>
              </div>
            </button>
          ))}
          </div>
        </div>
      </div>

      {isHasil && isBackendPeriodMode && dailyApiLoading ? (
        <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-xs font-bold text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-base animate-pulse">sync</span>
          Memuat data hasil produksi {periodLabel[period]?.toLowerCase() || period} dari backend...
        </div>
      ) : null}

      {isHasil && isBackendPeriodMode && dailyApiError ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-xs font-bold text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {dailyApiError}
        </div>
      ) : null}

      {isHasil ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-card-gap">
        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-mono text-on-surface-variant text-xs uppercase font-extrabold">Target Pabrik</p>
            <h4 className="font-display-lg text-xl font-black text-on-surface mt-1 font-mono">{kpi.target}</h4>
            <p className="text-[10px] text-on-surface-variant/80 font-bold mt-1 uppercase">{periodDescription[period]}</p>
          </div>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">flag</span>
        </div>

        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-mono text-on-surface-variant text-xs uppercase font-extrabold">Total Aktual Pabrik</p>
            <h4 className="font-display-lg text-xl font-black text-primary mt-1 font-mono">{kpi.actual}</h4>
            <p className="text-[10px] text-on-surface-variant/80 font-bold mt-1 uppercase">1 Ags 2026 - 19 Ags 2026</p>
          </div>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2.5 rounded-xl">fact_check</span>
        </div>

        <div className="bg-surface-container border border-outline-variant p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-mono text-on-surface-variant text-xs uppercase font-extrabold">Pencapaian Pabrik MTD</p>
            <h4 className={`font-display-lg text-xl font-black mt-1 font-mono ${parseFloat(kpi.achievement) >= 100 ? 'text-emerald-600' : 'text-red-600'}`}>{kpi.achievement}</h4>
          </div>
          <span className={`material-symbols-outlined p-2.5 rounded-xl ${parseFloat(kpi.achievement) >= 100 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>verified</span>
        </div>
      </div>
      ) : null}

      {isHasil ? (
      <div className={`grid grid-cols-1 ${cards.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-card-gap`}>
        {cards.map((card) => (
          (() => {
            const pctVal = parseFloat(card.pct);
            const isMet = pctVal >= 100;
            return (
          <article key={card.title} className="bg-surface-container border border-outline-variant p-6 rounded-2xl transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
                <h3 className="font-headline-md text-xl font-black text-on-surface tracking-tight">{card.title}</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold font-mono border shadow-sm ${isMet ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-red-500/15 text-red-600 border-red-500/30'}`}>
                  <span className="material-symbols-outlined text-sm">{isMet ? 'trending_up' : 'trending_down'}</span> {card.pct}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                <div className="bg-surface-container-high/70 border border-outline-variant/60 rounded-xl p-3.5">
                  <span className="text-xs font-label-mono uppercase tracking-wider font-extrabold text-on-surface-variant">Target</span>
                  <h4 className="font-display-lg text-xl lg:text-2xl font-black text-on-surface font-mono">{card.target}</h4>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5">
                  <span className="text-xs font-label-mono uppercase tracking-wider font-extrabold text-primary">Aktual</span>
                  <h4 className="font-display-lg text-xl lg:text-2xl font-black text-primary font-mono">{card.actual}</h4>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3.5 border-t border-outline-variant/40">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-on-surface-variant font-bold">Realisasi Target</span>
                <span className={`font-black ${card.gap.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>Selisih: {card.gap}</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden p-0.5 border border-outline-variant/40">
                <div className={`${isMet ? 'bg-emerald-500' : 'bg-red-500'} h-2 rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${Math.min(pctVal, 100)}%` }} />
              </div>
            </div>
          </article>
            );
          })()
        ))}
      </div>
      ) : null}

      {isHasil ? (
      <div className="bg-surface-container border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 py-4 border-b border-outline-variant/60 gap-4 bg-surface-container-low/20">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">table_chart</span>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">{isYearly ? 'Hasil Produksi Bulanan' : 'Hasil Produksi Harian'}</h3>
              <p className="text-xs text-on-surface-variant font-medium">{isYearly ? 'Realisasi produksi bulanan (Jan - Agu) dalam satuan Ton' : 'Realisasi produksi harian dalam satuan Ton'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-extrabold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />&gt;= Target
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/15 text-red-600 border border-red-500/30 text-xs font-extrabold">
              <span className="w-2 h-2 bg-red-500 rounded-full" />&lt; Target
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {[
            { key: 'pipa', title: `Hasil Produksi Pipa${factory === 'all' ? ' (Wotan + Cirebon)' : ''}`, color: 'text-primary', icon: 'precision_manufacturing' },
            { key: 'fitting', title: `Hasil Produksi Fitting${factory === 'all' ? ' (Wotan + Cirebon)' : ''}`, color: 'text-secondary', icon: 'grid_view' },
            { key: 'selang', title: 'Hasil Produksi Selang', color: 'text-cyan-600', icon: 'water' },
          ].filter((cfg) => (cfg.key === 'selang' ? (activeHarianLineData.selang?.rows || []).length > 0 : true)).map((cfg) => {
            const sectionData = activeHarianLineData[cfg.key] || { columns: [], rows: [] };
            const columns = sectionData.columns || [];
            const rows = sectionData.rows || [];
            return (
              <div key={cfg.key} className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleHasilSection(cfg.key)}
                  aria-expanded={isHasilSectionOpen(cfg.key)}
                  aria-controls={`hasil-produksi-${cfg.key}`}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-high/40 hover:bg-surface-container-high transition-colors flex items-center justify-between gap-2 ${cfg.color}`}
                >
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 font-label-mono">
                    <span className="material-symbols-outlined text-base">{cfg.icon}</span>
                    {cfg.title}
                  </h4>
                  <span className="material-symbols-outlined text-on-surface-variant text-base">
                    {isHasilSectionOpen(cfg.key) ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                <div
                  id={`hasil-produksi-${cfg.key}`}
                  className={`${isHasilSectionOpen(cfg.key) ? 'block' : 'hidden'} overflow-x-auto custom-scrollbar border border-outline-variant/50 rounded-xl`}
                >
                  <table className="w-full border-collapse text-[16px] text-on-surface min-w-max">
                    <thead>
                      <tr className="bg-surface-container-high/80 border-b border-outline-variant/60 font-label-mono text-xs text-on-surface-variant uppercase tracking-wider">
                        <th rowSpan={2} className="px-4 py-3 font-bold text-left sticky left-0 z-10 bg-surface-container-high/80 min-w-[240px]">Lini &amp; Product Family</th>
                        <th colSpan={3} className="px-3 py-3 font-bold text-center whitespace-nowrap min-w-[300px] border-l border-outline-variant/30">Hasil Produksi Bulanan (Ton/Hari)</th>
                        {columns.map((col) => (
                          <th rowSpan={2} key={`${cfg.key}-${col.key}-col`} className="px-3 py-3 font-bold text-center whitespace-nowrap min-w-[96px] border-l border-outline-variant/30">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                      <tr className="bg-surface-container-low/70 border-b border-outline-variant/60 font-label-mono text-[16px] text-on-surface-variant uppercase tracking-wider">
                        <th className="px-2 py-2 font-bold text-center border-l border-outline-variant/30 whitespace-nowrap min-w-[100px] text-[11px]">Target Pabrik</th>
                        <th className="px-2 py-2 font-bold text-center border-l border-outline-variant/30 whitespace-nowrap min-w-[100px] text-[11px]">Aktual</th>
                        <th className="px-2 py-2 font-bold text-center border-l border-outline-variant/30 whitespace-nowrap min-w-[100px] text-[11px]">% Pencapaian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {rows.map((line) => (
                        <tr key={`${cfg.key}-${line.key}`} className={`hover:bg-surface-container-high/25 transition-colors ${line.isTotal ? 'bg-surface-container-high/20' : ''}`}>
                          <td className={`px-4 py-3 sticky left-0 z-[1] bg-surface ${line.isTotal ? 'font-black uppercase text-on-surface' : 'font-bold text-on-surface-variant'}`}>
                            {line.label}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold border-l border-outline-variant/20">
                            {formatTon(line.monthly.target)}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-black border-l border-outline-variant/20">
                            {formatTon(line.monthly.actual)}
                          </td>
                          <td className={`px-3 py-3 text-center font-mono font-black border-l border-outline-variant/20 ${line.monthly.pct >= 100 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {line.monthly.pct.toFixed(1)}%
                          </td>
                          {line.cells.map((cell) => (
                            <td key={`${cfg.key}-${line.key}-${cell.key}`} className="px-3 py-3 text-center border-l border-outline-variant/20">
                              {cell.actual === 0 ? (
                                <span className="text-on-surface-variant opacity-40 font-mono">0</span>
                              ) : (
                                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg font-mono text-[16px] font-black border whitespace-nowrap ${cell.met ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-red-500/15 text-red-600 border-red-500/30'}`}>
                                  {formatTon(cell.actual)}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      ) : null}

      {isPerforma ? (
      <>
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-outline-variant/60 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2.5 rounded-2xl font-black">bar_chart</span>
              <div>
                <h3 className="font-headline-md text-lg font-black text-on-surface">Performa Mesin</h3>
                <p className="text-xs text-on-surface-variant font-medium">Ringkasan status operasional dan pencapaian target performance (Standar: 90%)</p>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${performaCards.length > 2 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'} gap-5`}>
            {performaCards.map((card) => (
              <article key={card.type} className="bg-surface-container border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">{card.icon}</span>
                    <h4 className="text-on-surface font-black tracking-wide text-xl leading-none">{card.title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-black">{card.total} Mesin</span>
                </div>

                <div className="mt-6 border-t border-outline-variant/40 pt-3">
                  <p className="text-xs font-black text-on-surface-variant uppercase">{card.statusLabel}:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { key: 'Running', cls: 'bg-emerald-500/12 text-emerald-600 border-emerald-500/30', dot: 'bg-emerald-500' },
                      { key: 'Overhaul', cls: 'bg-amber-500/12 text-amber-600 border-amber-500/30', dot: 'bg-amber-500' },
                      { key: 'Repair Internal', cls: 'bg-orange-500/12 text-orange-600 border-orange-500/30', dot: 'bg-orange-500' },
                      { key: 'Repair External', cls: 'bg-red-500/12 text-red-600 border-red-500/30', dot: 'bg-red-500' },
                      { key: 'No Order', cls: 'bg-slate-500/12 text-slate-600 border-slate-500/30', dot: 'bg-slate-500' },
                      { key: 'No Active', cls: 'bg-slate-500/12 text-slate-600 border-slate-500/30', dot: 'bg-slate-500' },
                      { key: 'Chrome', cls: 'bg-indigo-500/12 text-indigo-600 border-indigo-500/30', dot: 'bg-indigo-500' },
                    ].map((st) => (
                      <span key={`${card.type}-${st.key}`} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black uppercase ${st.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.key}: {card.statusCounts[st.key]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-outline-variant/40 pt-3">
                  <p className="text-xs font-black text-on-surface-variant uppercase">PERFORMANCE:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2">
                      <p className="text-[10px] font-black text-red-600">&lt; 60%</p>
                      <p className="text-3xl font-black text-red-600">{card.perfLt60} Mesin</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                      <p className="text-[10px] font-black text-amber-600">60-80%</p>
                      <p className="text-3xl font-black text-amber-600">{card.perf60to80} Mesin</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                      <p className="text-[10px] font-black text-emerald-600">&gt;= 80%</p>
                      <p className="text-3xl font-black text-emerald-600">{card.perfGe80} Mesin</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container border border-outline-variant px-6 py-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl font-bold">settings_input_component</span>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface">Rincian Performa Mesin</h3>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {groupedMachineDetails.map((group) => (
              <div key={group.type} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.type)}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-surface-container-high/50 border border-outline-variant/40 hover:bg-surface-container-high transition-colors"
                >
                  <h4 className="text-xs font-black text-primary uppercase tracking-wider flex items-center gap-2 font-label-mono">
                    <span className="material-symbols-outlined text-base">{group.icon}</span>
                    {group.title} ({group.rows.length} Mesin)
                  </h4>
                  <span className="material-symbols-outlined text-on-surface-variant">{isGroupOpen(group.type) ? 'expand_less' : 'expand_more'}</span>
                </button>

                <div className={`${isGroupOpen(group.type) ? 'block' : 'hidden'} overflow-x-auto custom-scrollbar border border-outline-variant/50 rounded-xl bg-surface-container`}>
                  <table className="w-full border-collapse text-left text-sm text-on-surface min-w-[1360px]">
                    <thead>
                      <tr className="bg-surface-container-high/80 border-b border-outline-variant/60 font-label-mono text-xs text-on-surface-variant uppercase tracking-wider">
                        <th className="px-4 py-3 font-bold">Plant</th>
                        <th className="px-4 py-3 font-bold">Kode</th>
                        <th className="px-4 py-3 font-bold">Nama Mesin</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold text-right">Target SPK</th>
                        <th className="px-4 py-3 font-bold text-right">Total Actual Output</th>
                        <th className="px-4 py-3 font-bold text-right">Output Bagus</th>
                        <th className="px-4 py-3 font-bold text-right">Waste</th>
                        <th className="px-4 py-3 font-bold text-right">Waste Runner</th>
                        <th className="px-4 py-3 font-bold text-right">Reject</th>
                        <th className="px-4 py-3 font-bold text-right">Rework</th>
                        <th className="px-4 py-3 font-bold text-right">Total Reject + Waste</th>
                        <th className="px-4 py-3 font-bold text-right">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {group.rows.map((row) => (
                        <tr key={`${row.plant}-${row.name}`} className="hover:bg-surface-container-high/35 transition-colors">
                          <td className="px-4 py-3 font-bold">{row.plant}</td>
                          <td className="px-4 py-3 font-mono">{row.code}</td>
                          <td className="px-4 py-3">{row.name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-black border uppercase ${
                              row.status === 'Running' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-error/10 text-error border-error/20'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono">{row.target}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.actual}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.outputGood}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.waste}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.wasteRunner}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.reject}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.rework}</td>
                          <td className="px-4 py-3 text-right font-mono">{row.totalLossPct}</td>
                          <td className="px-4 py-3 text-right font-mono font-black">{row.performance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
      ) : null}
    </section>
  );
}
