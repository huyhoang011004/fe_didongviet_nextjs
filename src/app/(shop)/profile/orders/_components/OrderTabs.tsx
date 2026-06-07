import React from 'react';

interface Tab {
  key: string;
  label: string;
}

interface OrderTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (key: string) => void;
  getFilteredOrders: (key: string) => any[];
}

export default function OrderTabs({ tabs, activeTab, setActiveTab, getFilteredOrders }: OrderTabsProps) {
  return (
    <div className='flex gap-1 border-b border-slate-100 pb-0.5 overflow-x-auto scrollbar-none select-none'>
      {tabs.map((tab) => {
        const count = getFilteredOrders(tab.key).length;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2.5 text-[11px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer bg-transparent border-none
              ${isActive
                ? 'border-didongviet-red text-didongviet-red font-black'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }
            `}
          >
            {tab.label}
            {count > 0 && (
              <span className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full font-bold
                ${isActive ? 'bg-red-100 text-didongviet-red' : 'bg-slate-100 text-slate-550'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
