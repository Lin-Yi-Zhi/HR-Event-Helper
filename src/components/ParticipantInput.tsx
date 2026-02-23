import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Trash2, Users, AlertCircle, Wand2 } from 'lucide-react';

interface Props {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ParticipantInput({ participants, setParticipants }: Props) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFromText = () => {
    const newNames = inputText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (newNames.length > 0) {
      setParticipants(prev => [...prev, ...newNames]);
      setInputText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        // Assuming CSV might have header or just list of names.
        // We flatten the 2D array and filter out empty strings
        const names = results.data
          .flat()
          .map(val => String(val).trim())
          .filter(val => val.length > 0);
        
        setParticipants(prev => [...prev, ...names]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('CSV 讀取失敗，請檢查檔案格式。');
      }
    });
  };

  const handleClear = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    setParticipants(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveDuplicates = () => {
    setParticipants(prev => Array.from(new Set(prev)));
  };

  const handleLoadMockData = () => {
    const mockData = [
      '王小明', '李大華', '張三', '李四', '王五', '趙六', '孫七', '周八', '吳九', '鄭十',
      '陳一', '林二', '黃三', '張三', '李四' // Intentionally added duplicates
    ];
    setParticipants(prev => [...prev, ...mockData]);
  };

  // Find duplicates to highlight them
  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(name => {
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return new Set(Array.from(counts.entries()).filter(([_, count]) => count > 1).map(([name]) => name));
  }, [participants]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="text-indigo-500" size={20} />
              貼上名單
            </h2>
            <button
              onClick={handleLoadMockData}
              className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Wand2 size={16} />
              載入模擬名單
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-3">每行輸入一個名字，或直接貼上 Excel 欄位內容。</p>
          <textarea
            className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="王小明&#10;李大華&#10;張三..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddFromText}
            disabled={!inputText.trim()}
            className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            加入名單
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="text-indigo-500" size={20} />
            上傳 CSV 檔案
          </h2>
          <p className="text-sm text-slate-500 mb-4">上傳包含名單的 CSV 檔案，系統會自動擷取所有文字。</p>
          
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto text-slate-400 mb-3" size={32} />
            <p className="text-sm font-medium text-slate-700">點擊選擇檔案</p>
            <p className="text-xs text-slate-500 mt-1">支援 .csv 格式</p>
          </div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="text-indigo-500" size={20} />
            目前名單 ({participants.length})
          </h2>
          <div className="flex items-center gap-3">
            {duplicates.size > 0 && (
              <button
                onClick={handleRemoveDuplicates}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <AlertCircle size={16} />
                移除重複 ({participants.length - Array.from(new Set(participants)).length})
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                清空
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {participants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Users size={48} className="mb-4 opacity-20" />
              <p>目前沒有名單，請從左側加入</p>
            </div>
          ) : (
            participants.map((name, index) => {
              const isDuplicate = duplicates.has(name);
              return (
                <div 
                  key={`${name}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg border group transition-colors ${
                    isDuplicate 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDuplicate ? 'text-amber-800' : 'text-slate-700'}`}>
                      {name}
                    </span>
                    {isDuplicate && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        重複
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDuplicate ? 'text-amber-400 hover:text-amber-600' : 'text-slate-400 hover:text-red-500'
                    }`}
                    title="移除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
