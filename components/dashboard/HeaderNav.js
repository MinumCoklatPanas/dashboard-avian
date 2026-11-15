export default function HeaderNav({ activeTab, onChangeTab, onChangeProduksiSubmenu }) {
  const base =
    'header-tab-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-label-mono transition-all shrink-0 whitespace-nowrap active:scale-95';

  const comingSoon =
    'header-tab-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-label-mono transition-all shrink-0 whitespace-nowrap text-on-surface-variant/70 bg-surface-container-low cursor-not-allowed';

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-outline-variant/50 gap-4">
        <button
          type="button"
          onClick={() => onChangeTab('hasil_produksi')}
          title="Kembali ke Dashboard Produksi"
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-xl">factory</span>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-on-surface tracking-tight leading-tight">POWER</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-primary/15 text-primary border border-primary/25 font-mono">OEE</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-label-mono leading-none">Pipa &amp; Fitting</p>
          </div>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            <span className="p-2 text-on-surface-variant rounded-full">
              <span className="material-symbols-outlined text-lg">history</span>
            </span>
            <span className="p-2 text-on-surface-variant rounded-full relative">
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-background" />
            </span>
            <span className="p-2 text-on-surface-variant rounded-full">
              <span className="material-symbols-outlined text-lg">settings</span>
            </span>
          </div>

          <div className="h-6 w-px bg-outline-variant/60" />

          <div className="flex items-center gap-2.5 hover:bg-surface-container-high p-1 pr-3 rounded-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkCJ1qyZpSjcXD2NNmwpoMH6gsIw5V-yxqNRfTIPNPN9Ud_TkMh1n7ElYE5x5CmvRERiznMgdYCpaPw4c8tJCbdKbrmhJtK4ya1U89D0FDPTIwH79wwTV8j61Ry1T60N4Pv3twc1YWIfRqngJPv5yenOJ7KJXQikJ9HeHLvsQ07bJnRejt5BhgH9NyMNlTHTSFhq2eyiulflWLIQLCdrEbfVVsMu3j3wrMz3U_b5SyDylUfZetUAbfI6eruzrSCbCxvE7Dh_vgP3O6"
                alt="User Profile"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-body-sm font-bold text-on-surface leading-tight">Alex Vance</span>
              <span className="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider leading-none">Lead Operator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface-container-lowest/80 px-3 lg:px-6 relative z-40">
        <nav className="flex items-center gap-1.5 py-2 overflow-x-auto custom-scrollbar" id="header-nav-tabs">
          <div className="relative group shrink-0" id="header-nav-group-produksi">
            <button
              type="button"
              onClick={() => onChangeProduksiSubmenu(activeTab === 'performa_mesin' ? 'performa_mesin' : 'hasil_produksi')}
              id="header-link-produksi"
              className={`${base} ${(activeTab === 'hasil_produksi' || activeTab === 'performa_mesin')
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
              <span>Produksi</span>
              <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover:rotate-180">expand_more</span>
            </button>

            <div className="absolute left-0 top-full pt-1.5 w-60 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-surface border border-outline-variant rounded-xl p-1.5 shadow-2xl backdrop-blur-xl bg-surface/98 flex flex-col gap-1 ring-1 ring-black/10">
                <button
                  type="button"
                  onClick={() => onChangeProduksiSubmenu('hasil_produksi')}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold font-label-mono transition-all ${activeTab === 'hasil_produksi' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">analytics</span>
                    <div className="text-left">
                      <span className="block font-black leading-tight">Hasil Produksi</span>
                      <span className="block text-[10px] text-on-surface-variant font-normal">Realisasi &amp; Output</span>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${activeTab === 'hasil_produksi' ? 'bg-primary' : 'bg-transparent'}`} />
                </button>

                <div className="h-px bg-outline-variant/60 my-0.5" />

                <button
                  type="button"
                  onClick={() => onChangeProduksiSubmenu('performa_mesin')}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold font-label-mono transition-all ${activeTab === 'performa_mesin' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">speed</span>
                    <div className="text-left">
                      <span className="block font-black leading-tight">Performa Mesin</span>
                      <span className="block text-[10px] text-on-surface-variant font-normal">OEE &amp; Status Mesin</span>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${activeTab === 'performa_mesin' ? 'bg-primary' : 'bg-transparent'}`} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeTab('backorder')}
            className={`${base} ${
              activeTab === 'backorder'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-amber-500">pending_actions</span>
            <span>Back Order</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-error/15 text-error border border-error/30 font-mono">11 SKU</span>
          </button>

          <button type="button" disabled className={comingSoon} title="Belum dikonversi">
            <span className="material-symbols-outlined text-sm">fact_check</span>
            <span>QC</span>
          </button>

          <button type="button" disabled className={comingSoon} title="Belum dikonversi">
            <span className="material-symbols-outlined text-sm">build</span>
            <span>Maintenance</span>
          </button>

          <button type="button" disabled className={comingSoon} title="Belum dikonversi">
            <span className="material-symbols-outlined text-sm">engineering</span>
            <span>Engineering</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
