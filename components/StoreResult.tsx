import React, { useState, useEffect } from 'react';
import { SearchResult, StoreInfo } from '../types';
import { GlassCard } from './GlassCard';

interface StoreResultProps {
    result: SearchResult;
}

export const StoreResult: React.FC<StoreResultProps> = ({ result }) => {
    const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null);

    // Set the first store as default selected
    useEffect(() => {
        if (result.stores.length > 0) {
            setSelectedStore(result.stores[0]);
        }
    }, [result]);

    return (
        <div className="w-full flex flex-col gap-6 animate-[float_0.6s_ease-out]">

            {/* iOS Style List Container */}
            <GlassCard className="p-0 overflow-hidden border-gray-200/50 bg-white/70">
                <div className="backdrop-blur-xl">
                    <div className="px-5 py-3 border-b border-gray-200/50 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            搜尋結果 ({result.stores.length})
                        </h3>
                        <span className="text-[10px] text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full">
                            按距離排序
                        </span>
                    </div>

                    <div className="divide-y divide-gray-200/50">
                        {result.stores.map((store, index) => {
                            const isSelected = selectedStore?.address === store.address;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedStore(store)}
                                    className={`
                    relative cursor-pointer transition-all duration-200
                    p-4 flex items-center justify-between group
                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    `}
                                >
                                    {/* Left: Info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {/* Rank Circle */}
                                        <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-bold transition-all
                            ${isSelected
                                                ? 'bg-[#007AFF] text-white shadow-[0_0_10px_rgba(0,122,255,0.5)]'
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
                        `}>
                                            {index + 1}
                                        </div>

                                        <div className="flex flex-col min-w-0 space-y-0.5">
                                            <h3 className={`text-lg font-bold truncate pr-2 transition-colors ${isSelected ? 'text-[#007AFF]' : 'text-gray-900'}`}>
                                                {store.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                                                {store.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Distance & Arrow */}
                                    <div className="flex items-center gap-3 shrink-0 pl-2">
                                        <span className={`font-mono font-bold text-base whitespace-nowrap transition-colors ${isSelected ? 'text-[#0A84FF]' : 'text-gray-500'}`}>
                                            {store.distance}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 transition-colors ${isSelected ? 'text-[#007AFF]' : 'text-gray-300'}`}>
                                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </GlassCard>

            {/* Detail & Map Section (Only shows when something is selected) */}
            {selectedStore && (
                <div className="w-full space-y-4">
                    {/* Info Cards - Improved Contrast */}
                    <div className="grid grid-cols-2 gap-3">
                        <GlassCard className="p-4 flex flex-col justify-center items-center text-center gap-2 bg-white/70 shadow-sm">
                            <div className="p-2 rounded-full bg-green-500/10 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13.5a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75l4 4a.75.75 0 001.06-1.06l-3.56-3.56V4.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{selectedStore.hours}</span>
                            <span className="text-[10px] text-gray-500 uppercase">營業時間</span>
                        </GlassCard>
                        <GlassCard className="p-4 flex flex-col justify-center items-center text-center gap-2 bg-white/70 shadow-sm">
                            <div className="p-2 rounded-full bg-blue-500/10 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-400">
                                    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <a href={`tel:${selectedStore.phone}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2">
                                {selectedStore.phone}
                            </a>
                            <span className="text-[10px] text-gray-500 uppercase">聯絡電話</span>
                        </GlassCard>
                    </div>

                    <GlassCard className="p-0 overflow-hidden h-[350px] border-gray-200/50 relative group bg-gray-100">
                        {/* Map Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
                            <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">目前定位</p>
                                <p className="text-sm font-bold text-gray-900">{selectedStore.name}</p>
                            </div>
                        </div>

                        {/* 
                   Google Maps Embed Optimized for Dark Mode 
                   Filter explanation:
                   - grayscale(100%): Removes noisy colors from inversion (orange water, etc.)
                   - invert(100%): Turns standard map black.
                   - contrast(120%): Makes the road lines and text distinct against the black.
                   - brightness(95%): Prevents the whites from being blindingly bright.
                */}
                        <iframe
                            title="map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{
                                border: 0,
                                border: 0,
                                opacity: 1
                            }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                            className="bg-gray-100" // Fallback color while loading
                        ></iframe>

                        {/* Bottom Action Area Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-white/90 via-white/50 to-transparent">
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                            flex items-center justify-center gap-2 w-full
                            bg-[#007AFF] hover:bg-[#0062cc] text-white 
                            px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/30
                            transition-all active:scale-[0.98]
                        "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-1.5 0V9.75a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                </svg>
                                開啟導航 ({selectedStore.distance})
                            </a>
                        </div>
                    </GlassCard>

                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200/50 border border-gray-200/50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gray-500">
                                <path fillRule="evenodd" d="M9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.261 11.261 0 0 0 1.056.583c.09.048.175.063.196.064.04.002.09.002.196-.064Zm.006-9.043a3.1 3.1 0 1 1-2.064-1.543l.871.871.161.161.161-.16 2.065-2.065a3.1 3.1 0 0 1 2.064 1.543l-.871.871-.161.161-.161-.16-2.065-2.065ZM10 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-500 text-xs text-center font-mono">
                                {selectedStore.address}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};