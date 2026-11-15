'use client';

import { useMemo, useState } from 'react';
import { backOrderData } from '../../lib/data/backorder';

export default function BackorderPage() {
  const [plant, setPlant] = useState('Wotan');
  const [line, setLine] = useState('pipa');
  const [velocity, setVelocity] = useState('all');
  const [search, setSearch] = useState('');

  const [selectedRecommendationId, setSelectedRecommendationId] = useState(null);

  const activeLineData = useMemo(() => {
    return backOrderData
      .filter((item) => (plant === 'all' ? true : item.plant === plant))
      .filter((item) => item.line === line)
      .sort((a, b) => b.boTon - a.boTon);
  }, [plant, line]);

  const filtered = useMemo(() => {
    return activeLineData
      .filter((item) => (velocity === 'all' ? true : item.velocity === velocity))
      .filter((item) => item.desc.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.boTon - a.boTon);
  }, [activeLineData, velocity, search]);

  const lineOptions = useMemo(() => {
    if (plant === 'Cirebon') return ['pipa', 'fitting', 'selang'];
    return ['pipa', 'fitting'];
  }, [plant]);

  const totalTon = useMemo(() => activeLineData.reduce((sum, item) => sum + item.boTon, 0), [activeLineData]);

  const top10 = activeLineData.slice(0, 10);

  const detailGroups = useMemo(() => {
    const bySearchAndVelocity = activeLineData
      .filter((item) => (velocity === 'all' ? true : item.velocity === velocity))
      .filter((item) => item.desc.toLowerCase().includes(search.toLowerCase()));

    if (line === 'pipa') {
      return [
        { name: 'POWER', icon: 'power', items: bySearchAndVelocity.filter((i) => i.category === 'POWER'), theme: 'blue' },
        { name: 'POWER MAX', icon: 'bolt', items: bySearchAndVelocity.filter((i) => i.category === 'POWER MAX'), theme: 'amber' },
        { name: 'QUAD', icon: 'view_in_ar', items: bySearchAndVelocity.filter((i) => i.category === 'QUAD'), theme: 'purple' },
      ].filter((g) => g.items.length > 0);
    }

    if (line === 'fitting') {
      return [
        {
          name: 'POWER',
          icon: 'power',
          items: bySearchAndVelocity.filter((i) => !i.desc.toLowerCase().includes('quad')),
          theme: 'blue',
        },
        {
          name: 'QUAD',
          icon: 'view_in_ar',
          items: bySearchAndVelocity.filter((i) => i.desc.toLowerCase().includes('quad')),
          theme: 'purple',
        },
      ].filter((g) => g.items.length > 0);
    }

    return [
      { name: 'SELANG', icon: 'water', items: bySearchAndVelocity.filter((i) => i.category === 'SELANG'), theme: 'cyan' },
    ].filter((g) => g.items.length > 0);
  }, [activeLineData, line, velocity, search]);

  const detailCount = useMemo(() => detailGroups.reduce((sum, g) => sum + g.items.length, 0), [detailGroups]);

  const selectedSku = useMemo(() => {
    if (!top10.length) return null;
    return top10.find((item) => item.id === selectedRecommendationId) || top10[0];
  }, [top10, selectedRecommendationId]);

  const volumeCards = useMemo(() => {
    const sum = (rows) => rows.reduce((acc, row) => acc + row.boTon, 0);
    const avgHk = (rows) => {
      if (!rows.length) return 0;
      return rows.reduce((acc, row) => acc + row.boTon / row.rateTon, 0) / rows.length;
    };

    if (line === 'pipa') {
      const power = activeLineData.filter((item) => item.category === 'POWER');
      const powerMax = activeLineData.filter((item) => item.category === 'POWER MAX');
      const quad = activeLineData.filter((item) => item.category === 'QUAD');
      return [
        { title: 'Power', icon: 'power', color: 'primary', value: sum(power), hk: avgHk(power) },
        { title: 'Power Max', icon: 'bolt', color: 'secondary', value: sum(powerMax), hk: avgHk(powerMax) },
        { title: 'Quad', icon: 'view_in_ar', color: 'tertiary', value: sum(quad), hk: avgHk(quad) },
      ];
    }

    if (line === 'fitting') {
      const power = activeLineData.filter((item) => !item.desc.toLowerCase().includes('quad'));
      const quad = activeLineData.filter((item) => item.desc.toLowerCase().includes('quad'));
      return [
        { title: 'Merk Power', icon: 'power', color: 'primary', value: sum(power), hk: avgHk(power) },
        { title: 'Merk Quad', icon: 'view_in_ar', color: 'tertiary', value: sum(quad), hk: avgHk(quad) },
      ];
    }

    return [
      { title: 'Lini Selang', icon: 'water', color: 'cyan', value: sum(activeLineData), hk: avgHk(activeLineData) },
    ];
  }, [activeLineData, line]);

  const runningMachines = useMemo(() => {
    if (!selectedSku) return [];
    const prefix = line === 'fitting' ? 'I' : line === 'selang' ? 'S' : 'E';
    return [1, 2, 3].map((n) => {
      const seed = selectedSku.id * n;
      const output = Number((selectedSku.boTon * (0.15 + n * 0.08)).toFixed(2));
      return {
        name: `${prefix}${String(10 + seed).slice(-2)}`,
        output,
        performance: Number((87 + (seed % 10) * 1.1).toFixed(1)),
      };
    });
  }, [selectedSku, line]);

  const recommendationOptions = useMemo(() => {
    if (!selectedSku) return [];
    const statusPreset = ['busy', 'busy', 'idle', 'idle', 'repair'];
    const prefix = line === 'fitting' ? 'I' : line === 'selang' ? 'S' : 'E';
    return statusPreset.map((status, idx) => {
      const seed = selectedSku.id + idx + 1;
      return {
        id: `${selectedSku.id}-${idx}`,
        machine: `${prefix}${String(20 + seed).slice(-2)}`,
        standardOutput: Number((2.1 + idx * 0.6 + (seed % 4) * 0.25).toFixed(2)),
        performance: Number((84 + (seed % 12) * 1.2).toFixed(1)),
        runningItem: status === 'idle' ? '-' : idx % 2 ? 'Pow Pipa 4m D2 1.2' : 'Elbow AW 2" Power',
        stockRatio: Number((0.9 + ((seed % 6) * 0.14)).toFixed(2)),
        status,
      };
    });
  }, [selectedSku, line]);

  return (
    <section id="panel-backorder" className="panel-transition space-y-gutter-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 pb-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-amber-500 bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20">pending_actions</span>
          <h2 className="font-headline-lg text-2xl lg:text-3xl font-black text-on-surface">Manajemen Back Order (BO) Pabrik</h2>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded-xl px-3.5 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
          <span className="font-label-mono text-on-surface-variant text-[11px] uppercase">Periode:</span>
          <span className="font-label-mono text-on-surface font-bold text-xs lg:text-sm">Agustus 2026</span>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant p-5 lg:p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col space-y-1.5">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Pilih Pabrik:</span>
          <div className="flex flex-wrap bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-fit">
            {['Wotan', 'Cirebon', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPlant(p);
                  if (line === 'selang' && p !== 'Cirebon') setLine('pipa');
                  setSelectedRecommendationId(null);
                }}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs font-bold font-label-mono transition-all duration-200 ${
                  plant === p ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{p === 'all' ? 'domain' : 'factory'}</span>
                {p === 'all' ? 'Semua Pabrik' : `AAIP ${p}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center gap-1 bg-surface-container-high/60 border border-outline-variant/40 px-5 py-4 rounded-2xl shadow-inner min-h-28">
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Total Back Order</span>
            <span className="text-4xl lg:text-5xl font-black font-mono text-red-600 tracking-tight">{totalTon.toFixed(2)} Ton</span>
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Pilih Lini Produk:</span>
            <div className="flex flex-wrap items-stretch gap-1 bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-full min-h-16">
              {lineOptions.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLine(l);
                    setSelectedRecommendationId(null);
                  }}
                  className={`flex-1 min-w-[120px] justify-center px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    line === l ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{l === 'pipa' ? 'precision_manufacturing' : l === 'fitting' ? 'grid_view' : 'water'}</span>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${volumeCards.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : volumeCards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-card-gap`}>
        {volumeCards.map((card) => {
          const palette =
            card.color === 'primary'
              ? {
                  border: 'border-primary/20 hover:border-primary',
                  text: 'text-primary',
                  bg: 'bg-primary/10',
                }
              : card.color === 'secondary'
                ? {
                    border: 'border-secondary/20 hover:border-secondary',
                    text: 'text-secondary',
                    bg: 'bg-secondary/10',
                  }
                : card.color === 'tertiary'
                  ? {
                      border: 'border-tertiary/20 hover:border-tertiary',
                      text: 'text-tertiary',
                      bg: 'bg-tertiary/10',
                    }
                  : {
                      border: 'border-cyan-500/20 hover:border-cyan-500',
                      text: 'text-cyan-600',
                      bg: 'bg-cyan-500/10',
                    };

          const hkClass =
            card.hk > 7
              ? 'bg-red-500/15 text-red-600 border-red-500/30'
              : card.hk >= 3
                ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30';

          return (
            <article key={card.title} className={`bg-surface-container border-2 ${palette.border} p-5 rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/40">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${palette.bg} ${palette.text} material-symbols-outlined text-xl`}>{card.icon}</span>
                  <span className={`text-sm lg:text-base font-black uppercase font-label-mono tracking-wider ${palette.text}`}>{card.title}</span>
                </div>
              </div>
              <div className="mt-3.5">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Volume Back Order:</span>
                <h4 className="text-2xl lg:text-3xl font-black font-mono text-on-surface mt-1 tracking-tight">{card.value.toFixed(2)} Ton</h4>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="text-xs lg:text-sm font-bold text-on-surface-variant">Estimasi HK BO:</span>
                <span className={`font-mono text-sm lg:text-base font-black px-3 py-1 rounded-xl border ${hkClass}`}>{card.hk.toFixed(1)} Hari</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
        <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-outline-variant/60">
            <span className="material-symbols-outlined text-red-600 text-xl font-black bg-red-500/10 p-2 rounded-xl">format_list_numbered</span>
            <h4 className="font-black text-sm lg:text-base text-on-surface uppercase tracking-wide">Top 10 Back Order SKU</h4>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs lg:text-sm font-semibold min-w-[560px]">
              <thead>
                <tr className="text-on-surface-variant font-label-mono uppercase border-b border-outline-variant/40 text-[10px] tracking-wider">
                  <th className="pb-2 w-8 text-center">Rank</th>
                  <th className="pb-2">SKU / Produk</th>
                  <th className="pb-2 text-right">Volume BO (Ton)</th>
                  <th className="pb-2 text-center">HK BO</th>
                  <th className="pb-2 text-center">Status SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-medium">
                {top10.map((item, idx) => {
                  const hk = item.boTon / item.rateTon;
                  const velClass =
                    item.velocity === '01_Fast'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : item.velocity === '02_Moderate'
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                        : 'bg-slate-500/10 text-slate-600 border-slate-500/20';

                  const rankClass =
                    idx === 0
                      ? 'bg-red-500 text-white'
                      : idx === 1
                        ? 'bg-amber-500 text-white'
                        : idx === 2
                          ? 'bg-blue-500 text-white'
                          : 'bg-surface-container-highest text-on-surface-variant';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRecommendationId(item.id)}
                      className={`hover:bg-surface-container-high/40 transition-colors cursor-pointer ${selectedSku?.id === item.id ? 'bg-primary/10' : ''}`}
                    >
                      <td className="py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black font-mono ${rankClass}`}>{idx + 1}</span>
                      </td>
                      <td className="py-2.5">
                        <div className="font-bold text-on-surface">{item.desc}</div>
                        <div className="text-[10px] text-on-surface-variant font-label-mono uppercase">{item.category} ({item.plant})</div>
                      </td>
                      <td className="py-2.5 text-right font-mono font-black text-red-600">{item.boTon.toFixed(2)}</td>
                      <td className="py-2.5 text-center font-mono">{hk.toFixed(1)} HK</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-black uppercase font-mono ${velClass}`}>
                          {item.velocity === '01_Fast' ? 'Fast' : item.velocity === '02_Moderate' ? 'Mod' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/5 via-surface-container to-surface-container border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <h4 className="font-black text-sm lg:text-base text-emerald-600 uppercase tracking-wide">Rekomendasi Pemenuhan & Alokasi Mesin</h4>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase font-mono">Auto Allocator</span>
          </div>
          {!selectedSku ? (
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-4 text-sm text-on-surface-variant">
              Tidak ada data Back Order.
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/40">
                <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono block">SKU Prioritas Utama</span>
                <h5 className="text-base font-black text-on-surface mt-1">{selectedSku.desc}</h5>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
                  <span className="font-black text-red-600 font-mono">Total BO: {selectedSku.boTon.toFixed(2)} Ton</span>
                  <span className="font-bold text-on-surface-variant">Pabrik: {selectedSku.plant}</span>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 pb-1 border-b border-primary/10">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">engineering</span>
                    <span className="text-xs font-black uppercase tracking-wide text-primary">Mesin yang sedang mengerjakan SKU (3 Mesin)</span>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-xs min-w-[360px]">
                    <thead>
                      <tr className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-wider border-b border-primary/15">
                        <th className="pb-2 text-center font-bold">Mesin</th>
                        <th className="pb-2 text-center font-bold">Tonase (Ton/Hari)</th>
                        <th className="pb-2 text-center font-bold">Performance (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10 font-medium">
                      {runningMachines.map((m) => (
                        <tr key={m.name} className="hover:bg-primary/5 transition-colors">
                          <td className="py-2 text-center font-bold text-on-surface">{m.name}</td>
                          <td className="py-2 text-center font-mono font-black text-on-surface">{m.output.toFixed(2)}</td>
                          <td className="py-2 text-center font-mono font-bold text-on-surface">{m.performance.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Rekomendasi Alokasi Mesin Teroptimal (5 Opsi)</span>
                </div>

                {recommendationOptions.map((opt, idx) => {
                  const statusMeta =
                    opt.status === 'repair'
                      ? {
                          label: 'REPAIR',
                          badge: 'bg-red-500 text-white border-red-600',
                          card: 'border-2 border-red-400 bg-red-500/15',
                        }
                      : opt.status === 'busy'
                        ? {
                            label: 'PRODUKSI ITEM LAIN',
                            badge: 'bg-yellow-400 text-yellow-950 border-yellow-500',
                            card: 'border-2 border-yellow-400 bg-yellow-500/15',
                          }
                        : {
                            label: 'TIDAK BERPRODUKSI',
                            badge: 'bg-white text-slate-700 border-slate-300',
                            card: 'border-2 border-slate-200 bg-white',
                          };

                  return (
                    <div key={opt.id} className={`p-4 rounded-xl ${statusMeta.card}`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-extrabold text-sm text-on-surface">{opt.machine}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono border ${statusMeta.badge}`}>{statusMeta.label}</span>
                          {idx === 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-yellow-400 text-yellow-950 border border-yellow-500">Rekomendasi Utama</span>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant">Standar Output: <strong className="text-on-surface font-mono">{opt.standardOutput.toFixed(2)} Ton/hari</strong></p>
                      <p className="text-xs text-on-surface-variant">Item Berjalan: <strong className="text-on-surface">{opt.runningItem}</strong></p>
                      <p className="text-xs text-on-surface-variant">Performance: <strong className="text-on-surface font-mono">{opt.performance.toFixed(1)}%</strong> • Ratio Stock: <strong className="text-emerald-600 font-mono">{opt.stockRatio.toFixed(2)}</strong></p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/60 bg-surface-container-low/40">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">table_chart</span>
              <h3 className="font-black text-base lg:text-xl text-on-surface">Daftar Rincian Back Order & Estimasi Hari Kerja (HK BO)</h3>
            </div>
            <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs lg:text-sm font-black font-label-mono">
              {detailCount} SKU Ditampilkan
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/40 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative w-full lg:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari SKU / Produk..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-xs lg:text-sm font-semibold focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs lg:text-sm font-black text-on-surface-variant uppercase tracking-wider font-label-mono whitespace-nowrap">Status SKU:</label>
              <select
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs lg:text-sm font-bold text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Semua Status SKU</option>
                <option value="01_Fast">01_Fast Moving</option>
                <option value="02_Moderate">02_Moderate</option>
                <option value="03_Slow">03_Slow Moving</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 lg:p-6 space-y-6">
          {detailGroups.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant border border-outline-variant/60 rounded-xl bg-surface-container-low">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/60 mb-2 font-black">info</span>
              <p className="text-sm font-bold">Tidak ada data Back Order yang sesuai dengan filter.</p>
            </div>
          ) : (
            detailGroups.map((group) => {
              const groupBo = group.items.reduce((sum, item) => sum + item.boTon, 0);
              const groupRate = group.items.reduce((sum, item) => sum + item.rateTon, 0);
              const groupAvgHk = group.items.length
                ? group.items.reduce((sum, item) => sum + item.boTon / item.rateTon, 0) / group.items.length
                : 0;

              const theme =
                group.theme === 'blue'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                  : group.theme === 'amber'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    : group.theme === 'purple'
                      ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                      : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30';

              return (
                <div key={group.name} className="bg-surface-container border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-outline-variant/60 bg-surface-container-low/60 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`p-1.5 rounded-lg ${theme} border material-symbols-outlined text-lg font-bold`}>{group.icon}</span>
                      <span className="text-sm lg:text-base font-black uppercase tracking-wider text-on-surface">{group.name}</span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-red-500/15 text-red-600 border border-red-500/30 font-mono">
                        Total BO: -{groupBo.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container border border-outline-variant/60 font-mono text-on-surface">
                      {group.items.length} SKU Terdaftar
                    </span>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[980px] text-left text-sm">
                      <thead>
                        <tr className="bg-surface-container-high/90 border-b-2 border-outline-variant font-label-mono text-xs text-on-surface uppercase tracking-wider">
                          <th className="px-5 py-4 font-black text-center w-14">No</th>
                          <th className="px-5 py-4 font-black">Deskripsi Produk (SKU)</th>
                          <th className="px-5 py-4 font-black text-center">SKU Status</th>
                          <th className="px-5 py-4 font-black text-right">Back Order (Ton)</th>
                          <th className="px-5 py-4 font-black text-right">Avg Prod / Day (Ton)</th>
                          <th className="px-5 py-4 font-black text-center">HK BO (Hari Kerja)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40 text-sm font-semibold">
                        {group.items.map((item, idx) => {
                          const hk = item.boTon / item.rateTon;
                          const hkClass = hk > 7 ? 'text-red-600' : hk >= 3 ? 'text-amber-600' : 'text-emerald-600';
                          const velBadge =
                            item.velocity === '01_Fast'
                              ? 'bg-blue-500/15 text-blue-600 border-blue-500/30'
                              : item.velocity === '02_Moderate'
                                ? 'bg-purple-500/15 text-purple-600 border-purple-500/30'
                                : 'bg-slate-500/15 text-slate-600 border-slate-500/30';

                          return (
                            <tr key={item.id} className="hover:bg-surface-container-high/50 transition-colors">
                              <td className="px-5 py-4 text-center font-mono font-bold text-sm text-on-surface-variant">{idx + 1}</td>
                              <td className="px-5 py-4 font-bold text-sm text-on-surface">{item.desc}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border uppercase font-mono ${velBadge}`}>
                                  {item.velocity}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-mono font-black text-red-600 text-base">-{item.boTon.toFixed(2)}</td>
                              <td className="px-5 py-4 text-right font-mono font-bold text-on-surface text-sm">{item.rateTon.toFixed(2)}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`font-mono text-base font-black ${hkClass}`}>{hk.toFixed(2)} Hari</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-surface-container-high border-t-2 border-outline-variant font-label-mono text-xs font-black text-on-surface">
                        <tr className="bg-surface-container-high/90">
                          <td colSpan={3} className="px-5 py-4 text-left uppercase text-xs font-black">TOTAL {group.name}</td>
                          <td className="px-5 py-4 text-right font-mono text-red-600 font-black text-base">-{groupBo.toFixed(2)}</td>
                          <td className="px-5 py-4 text-right font-mono text-on-surface font-black text-sm">{groupRate.toFixed(2)}</td>
                          <td className="px-5 py-4 text-center font-mono text-primary font-black text-base">{groupAvgHk.toFixed(2)} Hari (Avg)</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
