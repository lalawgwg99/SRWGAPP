
import React, { useState, useRef, useEffect } from 'react';
import { findNearestStore } from './services/geminiService';
import { searchStoreFees } from './services/feeService';
import { SearchResult, AppStatus, AppMode, StoreFeeData } from './types';
import { GlassCard } from './components/GlassCard';
import { StoreResult } from './components/StoreResult';
import { FeeResult } from './components/FeeResult';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.FIND_STORE);

  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);

  // Store Search Results
  const [storeResult, setStoreResult] = useState<SearchResult | null>(null);

  // Fee Search Results
  const [feeResult, setFeeResult] = useState<StoreFeeData[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]); // Focus on mode change

  // Clear data when switching modes
  const handleModeSwitch = (newMode: AppMode) => {
    setMode(newMode);
    setAddress('');
    setStatus(AppStatus.IDLE);
    setErrorMsg('');
    setStoreResult(null);
    setFeeResult([]);
  };

  const handleSearch = async (overrideAddress?: string, lat?: number, lng?: number) => {
    const query = overrideAddress || address;
    // Allow search if we have lat/lng even if address is empty (for "Locate Me")
    if (!query && (!lat || !lng)) return;

    setStatus(AppStatus.LOADING);
    setErrorMsg('');
    setStoreResult(null);
    setFeeResult([]);

    try {
      if (mode === AppMode.FIND_STORE) {
        // For Find Store, we use Gemini
        const data = await findNearestStore(query, lat, lng);
        setStoreResult(data);
      } else {
        // For Fee Check, we search the loaded CSV data
        const data = await searchStoreFees(query);
        setFeeResult(data);
      }
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("抱歉，發生錯誤或找不到資料。請稍後再試。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleLocateMe = () => {
    if (mode === AppMode.CHECK_FEE) return; // Disable for fee check

    if (!navigator.geolocation) {
      setErrorMsg("您的瀏覽器不支援地理定位功能。");
      return;
    }

    setStatus(AppStatus.LOADING);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Pass coordinates to search
        handleSearch("我的目前位置", position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setStatus(AppStatus.IDLE);
        setErrorMsg("無法獲取您的位置，請手動輸入地址。");
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen w-full text-[#1d1d1f] font-sans flex flex-col items-center py-10 px-4 md:px-0 relative overflow-x-hidden">

      {/* Background Ambience */}
      {/* Background Ambience - iOS uses subtle gradients or solid background, removing dark blobs */}
      <div className="fixed top-0 left-0 w-full h-full bg-[#F2F2F7] -z-10" />

      {/* Main Container - iOS Style Max Width */}
      <div className="w-full max-w-md z-10 flex flex-col gap-8 pb-20">

        {/* Header */}
        <header className="text-center space-y-4 mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] drop-shadow-sm">
            Carrefour Helper
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            幫你找找附近分店跟越區費用
          </p>

          <div className="bg-[#E5E5EA] p-1 rounded-xl flex relative mx-auto max-w-[280px]">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${mode === AppMode.FIND_STORE ? 'left-1' : 'left-[calc(50%+4px)]'}`}
            />

            <button
              onClick={() => handleModeSwitch(AppMode.FIND_STORE)}
              className={`flex-1 relative z-10 py-1.5 text-sm font-semibold transition-colors duration-200 ${mode === AppMode.FIND_STORE ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}
            >
              找分店
            </button>
            <button
              onClick={() => handleModeSwitch(AppMode.CHECK_FEE)}
              className={`flex-1 relative z-10 py-1.5 text-sm font-semibold transition-colors duration-200 ${mode === AppMode.CHECK_FEE ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}
            >
              查運費
            </button>
          </div>
        </header>

        {/* Search Section */}
        <section className="space-y-4">
          <GlassCard className="p-2 bg-white shadow-sm">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === AppMode.FIND_STORE ? "例如：高雄市鳳山區林森路291號" : "輸入店名關鍵字，如：五甲或WG"}
                disabled={status === AppStatus.LOADING}
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500/80 text-lg py-4 pl-12 pr-4 font-bold"
              />
              {address && (
                <button
                  onClick={() => setAddress('')}
                  className="absolute right-4 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          </GlassCard>

          <div className="flex gap-3">
            {mode === AppMode.FIND_STORE && (
              <button
                onClick={handleLocateMe}
                disabled={status === AppStatus.LOADING}
                className="flex-1 py-4 rounded-[1.5rem] bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-md shadow-gray-200 border border-transparent text-[#007AFF] font-bold flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                定位目前位置
              </button>
            )}

            <button
              onClick={() => handleSearch()}
              disabled={status === AppStatus.LOADING || (!address && !storeResult && !feeResult)}
              className={`
                    flex-1 py-4 rounded-[1.5rem] font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95
                    ${status === AppStatus.LOADING ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#007AFF] hover:bg-[#0062cc] shadow-blue-500/30'}
                `}
            >
              {status === AppStatus.LOADING ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  搜尋中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                  開始搜尋
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results Area */}
        <div className="w-full">
          {status === AppStatus.ERROR && (
            <GlassCard className="p-4 bg-red-100 border-red-200 text-center">
              <p className="text-red-700 font-medium">{errorMsg}</p>
            </GlassCard>
          )}

          {status === AppStatus.SUCCESS && mode === AppMode.FIND_STORE && storeResult && (
            <StoreResult result={storeResult} />
          )}

          {status === AppStatus.SUCCESS && mode === AppMode.CHECK_FEE && (
            <FeeResult data={feeResult} />
          )}
        </div>

        {/* Footer */}
        <footer className="w-full text-center pb-8 pt-4 space-y-2">
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">
            Designed by 德
          </p>
          <a
            href="https://github.com/lalawgwg99/SRWGAPP/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
          >
            使用說明
          </a>
        </footer>

      </div>
    </div>
  );
}
