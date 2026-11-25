'use client';

import { useEffect, useMemo, useState } from 'react';

function formatCategoryLabel(category) {
  const value = String(category || '').trim();
  if (!value) return 'Uncategorized';
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function iconByCategory(category) {
  const normalized = String(category || '').trim().toUpperCase();
  if (normalized === 'POWER') return 'power';
  if (normalized === 'POWER MAX') return 'bolt';
  if (normalized === 'QUAD') return 'view_in_ar';
  if (normalized === 'SELANG') return 'water';
  return 'category';
}

function themeByIndex(index) {
  const themes = ['blue', 'amber', 'purple', 'cyan', 'indigo'];
  return themes[index % themes.length];
}

function plantQueryValue(plant) {
  if (plant === 'Wotan') return 'wotan';
  if (plant === 'Cirebon') return 'cirebon';
  return 'all';
}

function getNumericSeed(value) {
  return String(value || '')
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export default function BackorderPage() {
  const [plant, setPlant] = useState('Wotan');
  const [line, setLine] = useState('pipa');
  const [velocity, setVelocity] = useState('all');
  const [search, setSearch] = useState('');
  const [boFiltersExpanded, setBoFiltersExpanded] = useState(false);
  const [boDashboardOpen, setBoDashboardOpen] = useState(false);
  const [boRecommendationFocused, setBoRecommendationFocused] = useState(false);
  const [boOthersExpanded, setBoOthersExpanded] = useState(false);
  const [backOrderRows, setBackOrderRows] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [backOrderError, setBackOrderError] = useState('');

  const [selectedRecommendationId, setSelectedRecommendationId] = useState(null);

  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (boDashboardOpen) {
      htmlEl.classList.add('bo-dashboard-open');
      bodyEl.classList.add('bo-dashboard-open');
    } else {
      htmlEl.classList.remove('bo-dashboard-open');
      bodyEl.classList.remove('bo-dashboard-open');
    }

    return () => {
      htmlEl.classList.remove('bo-dashboard-open');
      bodyEl.classList.remove('bo-dashboard-open');
    };
  }, [boDashboardOpen]);

  const isMobileViewport = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  };

  const focusRecommendationSection = () => {
    if (!isMobileViewport()) return;
    setBoFiltersExpanded(false);
    setBoRecommendationFocused(true);

    requestAnimationFrame(() => {
      document.getElementById('bo-recommendation-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleTopSkuRowClick = (skuId) => {
    setSelectedRecommendationId(skuId);
    focusRecommendationSection();
  };

  const toggleBoOthers = () => {
    setBoOthersExpanded((prev) => !prev);
  };

  const handleBackToList = () => {
    setBoRecommendationFocused(false);
    requestAnimationFrame(() => {
      document.getElementById('bo-ranking-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadBackOrderData() {
      setIsLoadingData(true);
      setBackOrderError('');

      try {
        const plantValue = plantQueryValue(plant);
        const response = await fetch(`/api/backorder?plant=${plantValue}`, {
          method: 'GET',
          cache: 'no-store',
        });

        const payload = await response.json();

        if (!response.ok) {
          const message = payload?.message || payload?.error || 'Failed to load Back Order data.';
          throw new Error(message);
        }

        if (!isCancelled) {
          setBackOrderRows(Array.isArray(payload?.items) ? payload.items : []);
          setSelectedRecommendationId(null);
        }
      } catch (error) {
        if (!isCancelled) {
          setBackOrderRows([]);
          setBackOrderError(error instanceof Error ? error.message : 'Failed to load Back Order data.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingData(false);
        }
      }
    }

    loadBackOrderData();

    return () => {
      isCancelled = true;
    };
  }, [plant]);

  const lineOptions = useMemo(() => {
    const order = ['pipa', 'fitting', 'selang'];
    const dynamicLines = Array.from(new Set(backOrderRows.map((item) => item.line))).filter(Boolean);
    dynamicLines.sort((a, b) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return dynamicLines.length ? dynamicLines : ['pipa'];
  }, [backOrderRows]);

  useEffect(() => {
    if (!lineOptions.includes(line)) {
      setLine(lineOptions[0]);
    }
  }, [lineOptions, line]);

  const activeLineData = useMemo(() => {
    return backOrderRows
      .filter((item) => item.line === line)
      .sort((a, b) => b.boTon - a.boTon);
  }, [backOrderRows, line]);

  const velocityFilteredLineData = useMemo(() => {
    return activeLineData
      .filter((item) => (velocity === 'all' ? true : item.velocity === velocity))
      .sort((a, b) => b.boTon - a.boTon);
  }, [activeLineData, velocity]);

  const velocityOptions = useMemo(() => {
    const unique = Array.from(new Set(activeLineData.map((item) => item.velocity).filter(Boolean)));
    return ['all', ...unique];
  }, [activeLineData]);

  const totalTon = useMemo(() => velocityFilteredLineData.reduce((sum, item) => sum + item.boTon, 0), [velocityFilteredLineData]);

  const sortedTopRanking = useMemo(() => [...velocityFilteredLineData].sort((a, b) => b.boTon - a.boTon), [velocityFilteredLineData]);
  const rankingTopItems = useMemo(() => sortedTopRanking.slice(0, 10), [sortedTopRanking]);
  const rankingOthersItems = useMemo(() => sortedTopRanking.slice(10), [sortedTopRanking]);
  const rankingExpandedItems = useMemo(() => (boOthersExpanded ? sortedTopRanking.slice(10) : []), [boOthersExpanded, sortedTopRanking]);

  const detailGroups = useMemo(() => {
    const bySearchAndVelocity = velocityFilteredLineData
      .filter((item) => item.desc.toLowerCase().includes(search.toLowerCase()));
    const grouped = bySearchAndVelocity.reduce((acc, item) => {
      const key = item.category || 'UNCATEGORIZED';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, items], index) => ({
        name,
        icon: iconByCategory(name),
        items,
        theme: themeByIndex(index),
      }))
      .sort((a, b) => b.items.reduce((sum, item) => sum + item.boTon, 0) - a.items.reduce((sum, item) => sum + item.boTon, 0));
  }, [velocityFilteredLineData, line, search]);

  const detailCount = useMemo(() => detailGroups.reduce((sum, g) => sum + g.items.length, 0), [detailGroups]);

  const selectedSku = useMemo(() => {
    if (!sortedTopRanking.length) return null;
    return sortedTopRanking.find((item) => item.id === selectedRecommendationId) || sortedTopRanking[0];
  }, [sortedTopRanking, selectedRecommendationId]);

  const volumeCards = useMemo(() => {
    const sum = (rows) => rows.reduce((acc, row) => acc + row.boTon, 0);
    const grouped = velocityFilteredLineData.reduce((acc, item) => {
      const key = item.category || 'UNCATEGORIZED';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, rows]) => ({
        title: formatCategoryLabel(category),
        icon: iconByCategory(category),
        value: sum(rows),
      }))
      .sort((a, b) => b.value - a.value);
  }, [velocityFilteredLineData, line]);

  const runningMachines = useMemo(() => {
    if (!selectedSku) return [];
    if (!Array.isArray(selectedSku.runningMachines)) return [];

    return selectedSku.runningMachines.map((machine, index) => ({
      name: machine.machine || `Machine-${index + 1}`,
      output: typeof machine.prodTon === 'number' ? machine.prodTon : 0,
      performance: typeof machine.performance === 'number' ? machine.performance : null,
    }));
  }, [selectedSku]);

  const recommendationOptions = useMemo(() => {
    if (!selectedSku) return [];
    const statusPreset = ['busy', 'busy', 'idle', 'idle', 'repair'];
    const prefix = line === 'fitting' ? 'I' : line === 'selang' ? 'S' : 'E';
    const seedBase = getNumericSeed(selectedSku.id);
    return statusPreset.map((status, idx) => {
      const seed = seedBase + idx + 1;
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

  useEffect(() => {
    setBoOthersExpanded(false);
  }, [plant, line, velocity, search]);

  return (
    <section id="panel-backorder" className={`panel-transition space-y-gutter-lg ${boRecommendationFocused ? 'bo-recommendation-focused' : ''}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-sky-600 bg-sky-500/10 w-11 h-11 rounded-xl border border-sky-500/20 shrink-0 relative">
              <span className="material-symbols-outlined absolute inset-0 m-auto w-fit h-fit text-2xl leading-none">pending_actions</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-2xl lg:text-3xl font-black text-on-surface">Manajemen Back Order (BO) Pabrik</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 select-none lg:self-center">
          <div className="bg-surface-container-high border border-outline-variant rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[13px]">calendar_month</span>
            <span className="font-label-mono text-on-surface-variant text-[10px] uppercase">Periode:</span>
            <span className="font-label-mono text-on-surface font-bold text-xs">Agustus 2026</span>
          </div>
        </div>
      </div>

      <div className={`bo-filter-panel bg-surface-container border border-outline-variant rounded-2xl shadow-sm ${boFiltersExpanded ? 'bo-filters-expanded' : ''}`}>
        <button
          id="bo-filter-toggle"
          type="button"
          aria-controls="bo-filter-options"
          aria-expanded={boFiltersExpanded}
          className="hidden"
          onClick={() => setBoFiltersExpanded((prev) => !prev)}
        >
          <span id="bo-filter-toggle-icon" className="material-symbols-outlined text-sm">tune</span>
          <span id="bo-filter-toggle-label">Filter BO</span>
        </button>

        <div id="bo-filter-options">
          <div className="flex flex-wrap items-end gap-4 lg:gap-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-label-mono block font-black">Pilih Pabrik:</span>
              <div className="flex flex-wrap bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-fit">
                {['all', 'Wotan', 'Cirebon'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPlant(p);
                  if (line === 'selang' && p !== 'Cirebon') setLine('pipa');
                  setSelectedRecommendationId(null);
                }}
                id={`btn-bo-plant-${String(p).toLowerCase()}-tab`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black font-label-mono transition-all duration-200 active:scale-95 ${
                  plant === p ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{p === 'all' ? 'domain' : 'factory'}</span>
                {p === 'all' ? 'All' : p === 'Wotan' ? 'IPW' : 'IPC'}
              </button>
            ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Pilih Lini Produk:</span>
              <div id="bo-line-tabs-container" className="flex flex-wrap items-center gap-1 bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-fit">
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

            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Tipe SKU:</span>
              <div id="bo-velocity-tabs-container" className="flex flex-wrap items-center gap-1 bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-fit">
                {velocityOptions.map((optionId) => (
                  <button
                    key={optionId}
                    type="button"
                    onClick={() => setVelocity(optionId)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black font-label-mono transition-all ${
                      velocity === optionId ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {optionId === 'all' ? 'Semua' : optionId}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-mono">Family Produk:</span>
              <div id="bo-family-tabs-container" className="flex flex-wrap items-center gap-1 bg-surface-container-high p-1 rounded-xl border border-outline-variant/60 w-fit">
                {detailGroups.map((group) => (
                  <span key={group.name} className="px-3 py-1.5 rounded-lg text-[11px] font-black font-label-mono text-on-surface-variant bg-surface-container-highest">
                    {group.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="bo-dashboard-picker">
          <button
            id="bo-dashboard-trigger"
            type="button"
            aria-controls="bo-dashboard-overlay"
            aria-expanded={boDashboardOpen}
            onClick={() => setBoDashboardOpen(true)}
          >
            <span className="material-symbols-outlined text-sm">layers</span>
            <span id="bo-dashboard-trigger-desktop">Operasional BO: BO Summary</span>
            <span id="bo-dashboard-trigger-mobile">Dashboard BO</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>

      <div
        id="bo-dashboard-overlay"
        aria-hidden={!boDashboardOpen}
        className={boDashboardOpen ? 'is-open' : ''}
        onClick={() => setBoDashboardOpen(false)}
      >
        <div id="bo-dashboard-menu" role="dialog" aria-label="Pilih dashboard Back Order" onClick={(event) => event.stopPropagation()}>
          <div id="bo-dashboard-menu-header" className="px-2 py-2 border-b border-outline-variant/50">
            <span className="text-xs font-black text-on-surface uppercase">Operasional Back Order</span>
            <button
              id="bo-dashboard-sheet-close"
              type="button"
              aria-label="Tutup pilihan dashboard"
              className="material-symbols-outlined text-on-surface-variant"
              onClick={() => setBoDashboardOpen(false)}
            >
              close
            </button>
          </div>
          <button type="button" className="bo-dashboard-option flex items-center justify-between rounded-lg bg-[#e2f2f4] text-[#2b6d7a] px-3 py-3 mt-2 text-xs font-black" onClick={() => setBoDashboardOpen(false)}>
            <span>1 &nbsp; BO Summary</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
          <button type="button" disabled className="bo-dashboard-option flex items-center justify-between rounded-lg px-3 py-3 text-xs font-bold text-on-surface-variant opacity-50 cursor-not-allowed">
            <span>2 &nbsp; Others</span>
            <span className="text-[10px]">Segera hadir</span>
          </button>
        </div>
      </div>

      {isLoadingData ? (
        <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-on-surface-variant">
          Memuat data Back Order dari backend...
        </div>
      ) : null}

      {backOrderError ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm font-bold text-red-700">
          Gagal memuat data Back Order: {backOrderError}
        </div>
      ) : null}

      <div
        id="bo-active-cards-grid"
        className={`grid grid-cols-1 ${line === 'pipa' ? 'sm:grid-cols-2 xl:grid-cols-4' : line === 'fitting' ? 'sm:grid-cols-2 xl:grid-cols-3 w-full' : 'w-full'} gap-card-gap`}
      >
        <article className="bg-surface-container border-2 border-slate-500/30 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 pb-3 border-b border-outline-variant/60 text-xs font-black text-slate-600 uppercase font-label-mono">
            <span className="material-symbols-outlined text-base">pending_actions</span>
            Total Back Order
          </div>
          <div className="mt-4">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Volume Back Order:</span>
            <h4 id="bo-total-overview-val" className="text-2xl lg:text-3xl font-black font-mono text-on-surface tracking-tight">{totalTon.toFixed(2)} Ton</h4>
          </div>
        </article>

        {volumeCards.map((card) => {
          return (
            <article key={card.title} className="bg-surface-container border-2 border-slate-500/30 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                <span className="text-xs font-black text-slate-600 uppercase font-label-mono flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">{card.icon}</span>
                  {card.title}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1">Volume Back Order:</span>
                <h4 className="text-2xl lg:text-3xl font-black font-mono text-on-surface tracking-tight">{card.value.toFixed(2)} Ton</h4>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-card-gap">
        <div id="bo-ranking-card" className="bg-surface-container border border-outline-variant p-4 rounded-2xl shadow-sm flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-outline-variant/60 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-red-600 text-lg font-black bg-red-500/10 p-1.5 rounded-lg">format_list_numbered</span>
              <h4 className="font-black text-sm lg:text-base text-on-surface uppercase tracking-wide">Top Back Order SKU</h4>
            </div>
            <span id="bo-ranking-today" className="self-end sm:self-auto text-[10px] font-semibold text-on-surface-variant font-label-mono">7 Agustus 2026</span>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-semibold min-w-0">
              <thead>
                <tr className="text-primary font-label-mono font-black uppercase border-b border-outline-variant/40 text-[10px] tracking-wider">
                  <th className="pb-2 w-8 text-center" aria-label="Urutan"></th>
                  <th className="pb-2">SKU / Produk</th>
                  <th className="pb-2 text-center"><span className="block">Family Produk /</span><span className="block">Status SKU /</span><span className="block">Lokasi</span></th>
                  <th className="pb-2 text-right"><span className="block">Total BO</span><span className="block">(Ton)</span></th>
                  <th className="pb-2 text-right"><span className="block">Sisa BO</span><span className="block">(Ton)</span><span className="block">per 16</span></th>
                </tr>
              </thead>
              <tbody id="bo-top10-tbody" className="divide-y divide-outline-variant/30 font-medium">
                {rankingTopItems.map((item, idx) => {
                  const velocityLabel = item.velocity || '-';
                  const remainingTon = typeof item.remainingBoTon === 'number' ? item.remainingBoTon : item.boTon;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleTopSkuRowClick(item.id)}
                      aria-current={selectedSku?.id === item.id ? 'true' : undefined}
                      className={`hover:bg-surface-container-high/40 transition-colors cursor-pointer ${selectedSku?.id === item.id ? 'bg-primary/10' : ''}`}
                    >
                      <td className="py-3 text-center font-mono font-black text-primary">
                        {idx < 10 ? idx + 1 : '↳'}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-on-surface text-sm lg:text-base leading-tight">{item.desc}</span>
                          <span className="text-[10px] text-on-surface-variant font-bold">{item.itemNo || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-on-surface-variant">
                        <div className="bo-family-status-location">
                          <div>
                            <span className="bo-mobile-label">Family Produk</span>
                            <span className="bo-mobile-value">{item.category}</span>
                          </div>
                          <div>
                            <span className="bo-mobile-label">Status SKU</span>
                            <span className="bo-mobile-value">{velocityLabel}</span>
                          </div>
                          <div>
                            <span className="bo-mobile-label">Lokasi</span>
                            <span className="bo-mobile-value">{item.plant}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-on-surface text-sm lg:text-base" data-mobile-label="Total BO (Ton)">
                        <div className="flex flex-col items-end">
                          <span className="bo-total-value font-black text-red-600">{item.boTon.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">(BO)</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-black text-sm text-on-surface" data-mobile-label="Sisa BO (Ton) per 16" title="Sisa BO = BO - Σ ProdTon mesin berjalan untuk ItemNo terkait">
                        {remainingTon.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

                {rankingOthersItems.length > 0 ? (
                  <tr
                    role="button"
                    tabIndex={0}
                    aria-expanded={boOthersExpanded}
                    onClick={toggleBoOthers}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleBoOthers();
                      }
                    }}
                    className="bg-surface-container-high/60 border-b border-outline-variant/30 cursor-pointer hover:bg-primary/10"
                  >
                    <td className="py-3 text-center font-mono font-black text-primary">11</td>
                    <td className="py-3 font-black text-on-surface">
                      Others <span className="text-xs font-semibold text-on-surface-variant">({rankingOthersItems.length} SKU) {boOthersExpanded ? 'Tutup' : 'Semua'}</span>
                    </td>
                    <td className="py-3 text-center text-on-surface-variant"><span className="bo-mobile-value">Campuran</span></td>
                    <td className="py-3 text-right font-mono text-on-surface" data-mobile-label="Total BO (Ton)">
                      <div className="flex flex-col items-end">
                        <span className="bo-total-value font-black text-red-600">{rankingOthersItems.reduce((sum, row) => sum + row.boTon, 0).toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant">(—)</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono font-black text-on-surface" data-mobile-label="Sisa BO (Ton) per 16" title="Sisa BO = BO - Σ ProdTon mesin berjalan untuk ItemNo terkait">
                      {rankingOthersItems.reduce((sum, row) => sum + (typeof row.remainingBoTon === 'number' ? row.remainingBoTon : row.boTon), 0).toFixed(2)}
                    </td>
                  </tr>
                ) : null}

                {rankingExpandedItems.map((item) => {
                  const velocityLabel = item.velocity || '-';
                  const remainingTon = typeof item.remainingBoTon === 'number' ? item.remainingBoTon : item.boTon;

                  return (
                    <tr
                      key={`others-${item.id}`}
                      onClick={() => handleTopSkuRowClick(item.id)}
                      aria-current={selectedSku?.id === item.id ? 'true' : undefined}
                      className={`hover:bg-surface-container-high/40 transition-colors cursor-pointer ${selectedSku?.id === item.id ? 'bg-primary/10' : ''}`}
                    >
                      <td className="py-3 text-center font-mono font-black text-primary">↳</td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-on-surface text-sm lg:text-base leading-tight">{item.desc}</span>
                          <span className="text-[10px] text-on-surface-variant font-bold">{item.itemNo || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-on-surface-variant">
                        <div className="bo-family-status-location">
                          <div>
                            <span className="bo-mobile-label">Family Produk</span>
                            <span className="bo-mobile-value">{item.category}</span>
                          </div>
                          <div>
                            <span className="bo-mobile-label">Status SKU</span>
                            <span className="bo-mobile-value">{velocityLabel}</span>
                          </div>
                          <div>
                            <span className="bo-mobile-label">Lokasi</span>
                            <span className="bo-mobile-value">{item.plant}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-on-surface text-sm lg:text-base" data-mobile-label="Total BO (Ton)">
                        <div className="flex flex-col items-end">
                          <span className="bo-total-value font-black text-red-600">{item.boTon.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-on-surface-variant">(BO)</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-black text-sm text-on-surface" data-mobile-label="Sisa BO (Ton) per 16" title="Sisa BO = BO - Σ ProdTon mesin berjalan untuk ItemNo terkait">
                        {remainingTon.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div id="bo-recommendation-card" className="bg-gradient-to-br from-emerald-500/5 via-surface-container to-surface-container border border-outline-variant rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-xl font-black bg-emerald-500/10 p-2 rounded-xl">verified</span>
              <h4 className="font-black text-sm lg:text-base text-on-surface uppercase tracking-wide">Rekomendasi Pemenuhan &amp; Alokasi Mesin</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase font-mono">Auto Allocator</span>
          </div>

          <button
            id="bo-back-to-list-button"
            className={boRecommendationFocused ? 'is-floating-visible' : ''}
            type="button"
            onClick={handleBackToList}
          >
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            Kembali ke daftar SKU
          </button>

          {!selectedSku ? (
            <div id="bo-recomm-container" className="bg-surface-container-high border border-outline-variant rounded-xl p-4 text-sm text-on-surface-variant">
              Tidak ada data Back Order.
            </div>
          ) : (
            <div id="bo-recomm-container" className="space-y-4 text-sm">
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
                    <span className="text-xs font-black uppercase tracking-wide text-primary">Mesin yang sedang mengerjakan SKU ({runningMachines.length} Mesin)</span>
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
                      {runningMachines.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-3 text-center text-on-surface-variant font-semibold">Tidak ada mesin berjalan untuk SKU ini.</td>
                        </tr>
                      ) : runningMachines.map((m) => (
                        <tr key={m.name} className="hover:bg-primary/5 transition-colors">
                          <td className="py-2 text-center font-bold text-on-surface">{m.name}</td>
                          <td className="py-2 text-center font-mono font-black text-on-surface">{m.output.toFixed(2)}</td>
                          <td className="py-2 text-center font-mono font-bold text-on-surface">{m.performance === null ? '-' : `${m.performance.toFixed(1)}%`}</td>
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
                    <div key={opt.id} className={`bo-machine-option p-4 rounded-xl ${statusMeta.card}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1.5">
                        <span className="bo-machine-name font-extrabold text-sm text-on-surface">{opt.machine}</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono border ${statusMeta.badge}`}>{statusMeta.label}</span>
                          {idx === 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono bg-yellow-400 text-yellow-950 border border-yellow-500">Rekomendasi Utama</span>
                          ) : null}
                        </div>
                      </div>
                      <p className="bo-machine-detail text-xs text-on-surface-variant">Standar Output: <strong className="text-on-surface font-mono">{opt.standardOutput.toFixed(2)} Ton/hari</strong></p>
                      <p className="bo-machine-detail text-xs text-on-surface-variant">Item Berjalan: <strong className="text-on-surface">{opt.runningItem}</strong></p>
                      <p className="bo-machine-detail text-xs text-on-surface-variant">Performance: <strong className="text-on-surface font-mono">{opt.performance.toFixed(1)}%</strong> • Ratio Stock: <strong className="text-emerald-600 font-mono">{opt.stockRatio.toFixed(2)}</strong></p>
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
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <label className="text-xs lg:text-sm font-black text-on-surface-variant uppercase tracking-wider font-label-mono whitespace-nowrap">Status SKU:</label>
              <select
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
                className="w-full sm:w-auto bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs lg:text-sm font-bold text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                {velocityOptions.map((optionId) => (
                  <option key={`select-${optionId}`} value={optionId}>
                    {optionId === 'all' ? 'Semua Status SKU' : optionId}
                  </option>
                ))}
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
              const rateItems = group.items.filter((item) => typeof item.rateTon === 'number' && item.rateTon > 0);
              const groupRate = rateItems.reduce((sum, item) => sum + item.rateTon, 0);
              const groupAvgHk = rateItems.length
                ? rateItems.reduce((sum, item) => sum + item.boTon / item.rateTon, 0) / rateItems.length
                : null;

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
                          const hk = typeof item.rateTon === 'number' && item.rateTon > 0 ? item.boTon / item.rateTon : null;
                          const hkClass = hk === null ? 'text-on-surface-variant' : hk > 7 ? 'text-red-600' : hk >= 3 ? 'text-amber-600' : 'text-emerald-600';
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
                              <td className="px-5 py-4 text-right font-mono font-bold text-on-surface text-sm">{typeof item.rateTon === 'number' ? item.rateTon.toFixed(2) : '-'}</td>
                              <td className="px-5 py-4 text-center">
                                <span className={`font-mono text-base font-black ${hkClass}`}>{hk === null ? '-' : `${hk.toFixed(2)} Hari`}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-surface-container-high border-t-2 border-outline-variant font-label-mono text-xs font-black text-on-surface">
                        <tr className="bg-surface-container-high/90">
                          <td colSpan={3} className="px-5 py-4 text-left uppercase text-xs font-black">TOTAL {group.name}</td>
                          <td className="px-5 py-4 text-right font-mono text-red-600 font-black text-base">-{groupBo.toFixed(2)}</td>
                          <td className="px-5 py-4 text-right font-mono text-on-surface font-black text-sm">{rateItems.length ? groupRate.toFixed(2) : '-'}</td>
                          <td className="px-5 py-4 text-center font-mono text-primary font-black text-base">{groupAvgHk === null ? '-' : `${groupAvgHk.toFixed(2)} Hari (Avg)`}</td>
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
