import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, ShieldAlert, ShieldCheck, Globe, AlertTriangle, Loader2, Link2, ExternalLink } from 'lucide-react';

const Pishing_domain = () => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [fetchingLive, setFetchingLive] = useState(true);

  useEffect(() => {
    fetchLiveDomains();
  }, []);

  const fetchLiveDomains = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/domains/live');
      setLiveData(response.data);
    } catch (error) {
      console.error("Failed to fetch live domains", error);
    } finally {
      setFetchingLive(false);
    }
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Please enter a URL first");

    setScanning(true);
    setScanResult(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/pishing-url/check',
        { url: url },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setScanResult(response.data);
      if (response.data.is_phishing) {
        toast.error("Malicious Domain Detected!");
      } else {
        toast.success("Domain appears to be safe.");
      }
    } catch (error) {
      toast.error("Scanning failed. Check server connection.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6236f5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Threat Scanner</h1>
          <p className="text-slate-400">Analyze any domain for phishing signatures using AI analysis.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] shadow-2xl mb-12">
          <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-800/40 border-transparent rounded-2xl py-5 pl-14 pr-4 text-white outline-none focus:ring-2 focus:ring-[#6236f5]/50 transition-all"
              />
            </div>
            <button 
              disabled={scanning}
              className="bg-[#6236f5] hover:bg-[#4f2ac4] px-10 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {scanning ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              {scanning ? 'Analyzing...' : 'Scan URL'}
            </button>
          </form>
        </div>

        {scanResult && (
          <div className={`mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 rounded-[2.5rem] border-2 flex flex-col md:flex-row items-center gap-8 ${
            scanResult.is_phishing ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
          }`}>
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 ${
              scanResult.is_phishing ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
            }`}>
              {scanResult.is_phishing ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${scanResult.is_phishing ? 'text-red-500' : 'text-emerald-500'}`}>
                {scanResult.is_phishing ? 'Phishing Detected' : 'Safe Domain'}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-2 font-mono">{scanResult.url}</p>
              <p className="text-slate-400 text-sm italic">{scanResult.reason}</p>
            </div>
          </div>
        )}

        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold">Live Global Threats</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Total Monitored: {liveData?.total_urls || 0}
            </span>
          </div>

          {fetchingLive ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#6236f5]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {liveData?.analysis?.url.map((threat, index) => (
                <div 
                  key={index} 
                  className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <AlertTriangle size={18} />
                    </div>
                    <span className="text-sm text-slate-300 truncate font-mono">{threat}</span>
                  </div>
                  <a 
                    href={threat} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              ))}
              
              <div className="mt-6 p-6 bg-[#6236f5]/5 rounded-3xl border border-[#6236f5]/10">
                <h3 className="text-[#6236f5] font-bold text-sm mb-2 flex items-center gap-2">
                  <Globe size={16} /> Analysis Report
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  {liveData?.analysis?.reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pishing_domain;