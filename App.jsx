import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShieldCheck, Zap, Globe, MessageSquare, CreditCard } from 'lucide-react';
import TradingChart from './TradingChart'; // Ensure you've created this file!

const BinaryApp = () => {
  // 1. STATE MANAGEMENT
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [demoBalance, setDemoBalance] = useState(10000.00);
  const [liveBalance, setLiveBalance] = useState(0.00);
  const [tradeAmount, setTradeAmount] = useState(100);
  const [btcPrice, setBtcPrice] = useState(null);

  // 2. LIVE PRICE FEED (WEBSOCKET)
  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBtcPrice(parseFloat(data.c).toFixed(2));
    };
    return () => socket.close();
  }, []);

  // 3. TRADE EXECUTION LOGIC
  const handleTrade = (direction) => {
    if (!isLiveMode) {
      if (demoBalance >= tradeAmount) {
        setDemoBalance(prev => prev - tradeAmount);
        alert(`DEMO: ${direction} trade placed at $${btcPrice}`);
      } else {
        alert("Insufficient Demo Funds!");
      }
    } else {
      alert("Please deposit funds to trade in Live Mode.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05080A] text-white flex flex-col font-sans">
      
      {/* HEADER & ASSET TICKER */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex animate-pulse gap-6 px-4 py-2 text-[10px] font-mono border-b border-white/5 overflow-hidden">
          <span className="text-blue-400">BTC/USDT: <span className="text-white">${btcPrice || 'Loading...'}</span></span>
          <span className="text-blue-400">TSLA: <span className="text-white">$182.45 (+1.2%)</span></span>
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <h1 className="font-black text-xl tracking-tighter italic">TESLA<span className="text-blue-500">BINARY</span></h1>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-800 rounded-full p-1 text-[10px] font-bold">
              <button onClick={() => setIsLiveMode(false)} className={`px-3 py-1 rounded-full transition ${!isLiveMode ? 'bg-blue-600' : ''}`}>DEMO</button>
              <button onClick={() => setIsLiveMode(true)} className={`px-3 py-1 rounded-full transition ${isLiveMode ? 'bg-orange-600' : ''}`}>LIVE</button>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase">Balance</p>
              <p className={`font-mono font-bold ${isLiveMode ? 'text-orange-400' : 'text-blue-400'}`}>
                ${isLiveMode ? liveBalance.toLocaleString() : demoBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN TRADING AREA */}
      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 mb-28 md:mb-0">
        <section className="flex-[3] bg-gray-900/40 rounded-3xl border border-white/5 overflow-hidden min-h-[400px]">
          <TradingChart />
        </section>

        <aside className="flex-1 flex flex-col gap-4">
          <div className="bg-gray-900/60 p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Investment Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  value={tradeAmount} 
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 p-4 pl-8 rounded-2xl focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
            
            <div className="hidden md:flex flex-col gap-3 mt-auto">
              <button onClick={() => handleTrade('CALL')} className="bg-[#00FF88] text-black font-bold p-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                <TrendingUp size={20}/> Call / High
              </button>
              <button onClick={() => handleTrade('PUT')} className="bg-[#FF3B3B] text-white font-bold p-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(255,59,59,0.2)]">
                <TrendingDown size={20}/> Put / Low
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* MOBILE FIXED CONTROLS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-white/10 grid grid-cols-2 gap-4 z-[100]">
        <button onClick={() => handleTrade('CALL')} className="bg-[#00FF88] text-black font-extrabold py-5 rounded-2xl flex flex-col items-center justify-center gap-1 uppercase italic shadow-lg">
          <TrendingUp size={24}/> <span className="text-xs">Higher</span>
        </button>
        <button onClick={() => handleTrade('PUT')} className="bg-[#FF3B3B] text-white font-extrabold py-5 rounded-2xl flex flex-col items-center justify-center gap-1 uppercase italic shadow-lg">
          <TrendingDown size={24}/> <span className="text-xs">Lower</span>
        </button>
      </div>

      {/* TRUST FOOTER */}
      <footer className="p-8 bg-black/60 border-t border-white/5 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2"><ShieldCheck className="mx-auto md:mx-0 text-blue-500"/><h4 className="text-xs font-bold uppercase">SSL SECURED</h4><p className="text-[10px] text-gray-500">End-to-end encrypted transactions.</p></div>
          <div className="space-y-2"><Zap className="mx-auto md:mx-0 text-yellow-500"/><h4 className="text-xs font-bold uppercase">FAST WITHDRAWALS</h4><p className="text-[10px] text-gray-500">Processed in under 24 hours.</p></div>
          <div className="space-y-2"><Globe className="mx-auto md:mx-0 text-green-500"/><h4 className="text-xs font-bold uppercase">GLOBAL REGULATION</h4><p className="text-[10px] text-gray-500">Compliant with international standards.</p></div>
        </div>
      </footer>
    </div>
  );
};

export default BinaryApp;
