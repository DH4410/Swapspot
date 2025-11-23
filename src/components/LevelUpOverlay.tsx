import React, { useEffect, useState } from 'react';
import { ChevronUp, Star, Sparkles } from 'lucide-react';

export const LevelUpOverlay: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in">
       <div className="relative animate-pop-in">
          {/* Glowing Background Effect */}
          <div className="absolute inset-0 bg-pastel-yellow/30 blur-[60px] rounded-full animate-pulse-fast"></div>
          
          {/* Glass Card */}
          <div className="relative bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl p-12 rounded-3xl flex flex-col items-center justify-center gap-6 transform hover:scale-105 transition-transform">
              
              {/* Icon Animation */}
              <div className="relative">
                 <div className="absolute -top-8 -left-8 animate-bounce delay-75">
                    <Sparkles className="w-12 h-12 text-pastel-yellow" />
                 </div>
                 <div className="absolute -bottom-4 -right-8 animate-bounce delay-150">
                    <Star className="w-10 h-10 text-pastel-orange fill-pastel-orange" />
                 </div>
                 <div className="bg-gradient-to-tr from-pastel-yellow to-pastel-orange p-6 rounded-full shadow-lg shadow-orange-500/20">
                    <ChevronUp className="w-20 h-20 text-white" strokeWidth={4} />
                 </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                  <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 drop-shadow-sm tracking-tight">
                    LEVEL UP!
                  </h1>
                  <p className="text-pastel-yellow font-bold tracking-widest uppercase text-lg drop-shadow-sm">
                    Grid Expanded
                  </p>
              </div>
          </div>
       </div>
    </div>
  );
};