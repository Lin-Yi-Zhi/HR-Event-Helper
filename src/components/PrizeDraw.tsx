import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Play, RotateCcw, Settings2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  participants: string[];
}

export default function PrizeDraw({ participants }: Props) {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>('準備抽籤');
  const [winners, setWinners] = useState<string[]>([]);
  
  // The pool of available participants
  const availableParticipants = allowRepeat 
    ? participants 
    : participants.filter(p => !winners.includes(p));

  const drawIntervalRef = useRef<number | null>(null);

  const handleDraw = () => {
    if (availableParticipants.length === 0) {
      alert('沒有可抽籤的名單了！');
      return;
    }

    setIsDrawing(true);
    let ticks = 0;
    const maxTicks = 30; // How many times it shuffles
    const speed = 50; // ms per shuffle

    drawIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      setCurrentName(availableParticipants[randomIndex]);
      ticks++;

      if (ticks >= maxTicks) {
        if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
        
        // Final selection
        const finalIndex = Math.floor(Math.random() * availableParticipants.length);
        const winner = availableParticipants[finalIndex];
        setCurrentName(winner);
        setWinners(prev => [winner, ...prev]);
        setIsDrawing(false);
        
        // Celebrate
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
        });
      }
    }, speed);
  };

  useEffect(() => {
    return () => {
      if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    };
  }, []);

  const handleReset = () => {
    if (confirm('確定要重置所有抽籤紀錄嗎？')) {
      setWinners([]);
      setCurrentName('準備抽籤');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Settings2 size={16} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={allowRepeat}
                onChange={(e) => setAllowRepeat(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
                disabled={isDrawing}
              />
              <span>允許重複中獎</span>
            </label>
          </div>

          <div className="mt-8 mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full mb-6">
              <Gift size={40} />
            </div>
            
            <div className="h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentName}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`text-5xl md:text-6xl font-bold tracking-tight ${
                    isDrawing ? 'text-slate-400' : 'text-indigo-600'
                  }`}
                >
                  {currentName}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <p className="text-slate-500 mt-4">
              可抽籤人數：<span className="font-semibold text-slate-700">{availableParticipants.length}</span> 人
            </p>
          </div>

          <button
            onClick={handleDraw}
            disabled={isDrawing || availableParticipants.length === 0}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-200"
          >
            {isDrawing ? (
              <span className="animate-pulse">抽籤中...</span>
            ) : (
              <>
                <Play size={24} />
                開始抽籤
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            中獎名單 ({winners.length})
          </h2>
          {winners.length > 0 && (
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
            >
              <RotateCcw size={16} />
              重置
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {winners.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Trophy size={48} className="mb-4 opacity-20" />
              <p>尚未抽出任何獎項</p>
            </div>
          ) : (
            winners.map((winner, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={`${winner}-${winners.length - index}`}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                  {winners.length - index}
                </div>
                <span className="font-bold text-slate-800 text-lg">{winner}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
