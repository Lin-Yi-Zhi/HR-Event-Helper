import React, { useState } from 'react';
import { Users, Gift, ListPlus } from 'lucide-react';
import ParticipantInput from './components/ParticipantInput';
import PrizeDraw from './components/PrizeDraw';
import RandomGrouping from './components/RandomGrouping';

export default function App() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'draw' | 'group'>('input');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">HR Event Helper</h1>
          </div>
          <nav className="flex space-x-1">
            <TabButton 
              active={activeTab === 'input'} 
              onClick={() => setActiveTab('input')}
              icon={<ListPlus size={18} />}
              label="名單輸入"
            />
            <TabButton 
              active={activeTab === 'draw'} 
              onClick={() => setActiveTab('draw')}
              icon={<Gift size={18} />}
              label="獎品抽籤"
            />
            <TabButton 
              active={activeTab === 'group'} 
              onClick={() => setActiveTab('group')}
              icon={<Users size={18} />}
              label="自動分組"
            />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'input' && (
          <ParticipantInput 
            participants={participants} 
            setParticipants={setParticipants} 
          />
        )}
        {activeTab === 'draw' && (
          <PrizeDraw participants={participants} />
        )}
        {activeTab === 'group' && (
          <RandomGrouping participants={participants} />
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
