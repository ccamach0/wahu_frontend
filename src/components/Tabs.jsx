import { useState } from 'react';

/**
 * Componente de Tabs para navegación de secciones
 * Soporta: icones, badges, contenido dinámico
 */
export default function Tabs({ tabs = [], defaultTab = 0, onChange, lazy = false }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    onChange?.(idx);
  };

  const activeTabData = tabs[activeTab];

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
              border-b-2 -mb-px
              ${
                activeTab === idx
                  ? 'border-wahu-500 text-wahu-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
            `}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 bg-wahu-100 text-wahu-700 rounded-full text-xs font-semibold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-4">
        {activeTabData && (
          <div className="animate-in fade-in-50 duration-200">
            {activeTabData.content}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Versión vertical de Tabs
 */
export function TabsVertical({ tabs = [], defaultTab = 0, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    onChange?.(idx);
  };

  const activeTabData = tabs[activeTab];

  return (
    <div className="flex gap-4">
      {/* Tab buttons */}
      <div className="flex flex-col gap-1 border-r border-gray-200 min-w-48">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`
              flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
              ${
                activeTab === idx
                  ? 'bg-wahu-100 text-wahu-600 border-l-4 border-wahu-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            <span className="flex-1 text-left">{tab.label}</span>
            {tab.badge && (
              <span className="px-2 py-0.5 bg-wahu-200 text-wahu-700 rounded-full text-xs font-semibold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1">
        {activeTabData && (
          <div className="animate-in fade-in-50 duration-200">
            {activeTabData.content}
          </div>
        )}
      </div>
    </div>
  );
}
