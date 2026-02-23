import React, { useState } from 'react';
import { Users, Shuffle, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  participants: string[];
}

export default function RandomGrouping({ participants }: Props) {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (participants.length === 0) {
      alert('請先輸入名單！');
      return;
    }
    if (groupSize < 1) {
      alert('每組人數必須大於 0！');
      return;
    }

    setIsGenerating(true);
    
    // Simulate a slight delay for effect
    setTimeout(() => {
      // Shuffle array
      const shuffled = [...participants].sort(() => 0.5 - Math.random());
      
      const newGroups: string[][] = [];
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 500);
  };

  const handleExportCSV = () => {
    if (groups.length === 0) return;
    
    let csvContent = "組別,成員\n";
    groups.forEach((group, index) => {
      csvContent += `第 ${index + 1} 組,"${group.join(', ')}"\n`;
    });

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', '分組結果.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">自動分組設定</h2>
            <p className="text-sm text-slate-500">總人數：{participants.length} 人</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 w-full sm:w-auto">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">每組人數：</label>
            <input
              type="number"
              min="1"
              max={Math.max(1, participants.length)}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-20 p-1.5 border border-slate-300 rounded-md text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || participants.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle size={18} />
            {isGenerating ? '分組中...' : '開始分組'}
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">分組結果 ({groups.length} 組)</h3>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
            >
              <Download size={16} />
              匯出 CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={`group-${index}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">第 {index + 1} 組</span>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded-full border border-slate-200 text-slate-500">
                    {group.length} 人
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {group.map((member, mIndex) => (
                      <li key={mIndex} className="flex items-center gap-2 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
