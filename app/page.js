'use client';

import { useState } from 'react';
import HeaderNav from '../components/dashboard/HeaderNav';
import HasilProduksiPage from '../features/hasil-produksi/HasilProduksiPage';
import BackorderPage from '../features/backorder/BackorderPage';

export default function Page() {
  const [activeTab, setActiveTab] = useState('hasil_produksi');

  const handleProduksiSubmenuChange = (submenu) => {
    setActiveTab(submenu);
  };

  return (
    <main className="w-full min-h-screen bg-background flex flex-col relative transition-all duration-300">
      <HeaderNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onChangeProduksiSubmenu={handleProduksiSubmenuChange}
      />

      <div className="p-gutter-lg max-w-[1600px] mx-auto w-full flex-1 flex flex-col">
        {activeTab === 'backorder' ? (
          <BackorderPage />
        ) : (
          <HasilProduksiPage produksiSubmenu={activeTab} onChangeProduksiSubmenu={handleProduksiSubmenuChange} />
        )}
      </div>
    </main>
  );
}
