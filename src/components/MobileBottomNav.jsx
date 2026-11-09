import React from 'react';
import { BookOpen, BookMarked, Calendar, FolderDown, Shield } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, currentRole }) {
  const tabs = [
    {
      id: 'progress',
      label: 'الدروس',
      icon: BookOpen,
      activeColor: 'text-indigo-600',
      activeBg: 'bg-indigo-50',
      activePill: 'bg-indigo-600'
    },
    {
      id: 'logbook',
      label: 'دفتر النصوص',
      icon: BookMarked,
      activeColor: 'text-emerald-600',
      activeBg: 'bg-emerald-50',
      activePill: 'bg-emerald-600'
    },
    {
      id: 'coordination',
      label: 'الفروض',
      icon: Calendar,
      activeColor: 'text-indigo-600',
      activeBg: 'bg-indigo-50',
      activePill: 'bg-indigo-600'
    },
    {
      id: 'documents',
      label: 'المكتبة',
      icon: FolderDown,
      activeColor: 'text-purple-600',
      activeBg: 'bg-purple-50',
      activePill: 'bg-purple-600'
    }
  ];

  if (currentRole === 'coordinator') {
    tabs.push({
      id: 'admin',
      label: 'المنسق',
      icon: Shield,
      activeColor: 'text-blue-600',
      activeBg: 'bg-blue-50',
      activePill: 'bg-blue-600'
    });
  }

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 py-1 px-1.5 shadow-lg shadow-slate-900/10 no-print">
      <div className="flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? `${tab.activeColor} ${tab.activeBg} font-bold`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {isActive && (
                  <span
                    className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${tab.activePill}`}
                  />
                )}
              </div>
              <span className="text-[10px] leading-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

