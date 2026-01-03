
import React from 'react';
import { StoreFeeData } from '../types';
import { GlassCard } from './GlassCard';

interface FeeResultProps {
    data: StoreFeeData[];
}

export const FeeResult: React.FC<FeeResultProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <GlassCard className="p-8 text-center border-gray-200 bg-white/70">
                <p className="text-gray-500">找不到符合的店家資料。</p>
                <p className="text-gray-400 text-sm mt-2">請嘗試輸入較短的關鍵字，例如「愛河」或「鳳山」。</p>
            </GlassCard>
        );
    }

    return (
        <div className="w-full flex flex-col gap-5 animate-[float_0.6s_ease-out]">
            {data.map((storeData) => (
                <GlassCard key={storeData.id} className="p-0 overflow-hidden bg-white/95 shadow-lg shadow-black/5">
                    {/* iOS 18.1 Header */}
                    <div className="px-5 py-4 border-b border-black/5 bg-gradient-to-r from-[#007AFF]/10 to-[#5856d6]/10 backdrop-blur-xl">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#007AFF]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#007AFF]">
                                    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg tracking-wide text-[#1d1d1f]">
                                {storeData.storeName}
                            </h3>
                        </div>
                        <p className="text-xs mt-1 ml-9 text-[#8e8e93]">
                            跨區費用價目表
                        </p>
                    </div>

                    {/* iOS 18.1 Table Header */}
                    <div className="flex bg-[#f8f9fa]/50 border-b border-black/5 text-[11px] text-[#8e8e93] uppercase tracking-widest font-semibold">
                        <div className="w-24 px-4 py-2 text-right border-r border-black/5">
                            跨區費
                        </div>
                        <div className="flex-1 px-4 py-2">範圍區域</div>
                    </div>

                    {/* iOS 18.1 Fee List */}
                    <div className="divide-y divide-black/5">
                        {storeData.schedules.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="flex transition-all duration-200 group hover:bg-black/5"
                            >
                                {/* Price Column */}
                                <div className="w-24 shrink-0 p-4 flex items-center justify-end border-r border-black/5 bg-[#f8f9fa]/30">
                                    <span className="text-[#34c759] font-mono font-semibold text-base group-hover:scale-105 transition-transform">
                                        {item.price}
                                    </span>
                                </div>

                                {/* Range Column */}
                                <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                                    <p className="text-sm font-medium leading-relaxed text-[#1d1d1f]">
                                        {item.range}
                                    </p>
                                    {item.note && (
                                        <p className="text-[#ff9500] text-xs mt-1 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                            </svg>
                                            {item.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
