import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, Search, ArrowRight, ShieldAlert } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6236f5]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6236f5]/10 border border-[#6236f5]/30 mb-8 animate-bounce">
            <ShieldCheck size={16} className="text-[#6236f5]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#6236f5]">AI-Powered Security v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Identify Phishing <br /> 
            <span className="bg-gradient-to-r from-white via-slate-300 to-[#6236f5] bg-clip-text text-transparent">
              Before It Strikes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12">
            PhishGuard uses advanced Machine Learning to analyze domain patterns, SSL certificates, and metadata to protect you from malicious threats in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/threat-scan')}
              className="w-full sm:w-auto bg-[#6236f5] hover:bg-[#4f2ac4] text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl shadow-[#6236f5]/30 flex items-center justify-center gap-3 group"
            >
              Start Threat Scan
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="w-full sm:w-auto bg-slate-800/40 hover:bg-slate-800/60 border border-white/10 text-white font-bold py-4 px-10 rounded-2xl transition-all backdrop-blur-md"
            >
              How it Works
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-[#6236f5]/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6236f5]/20 transition-all">
              <Zap className="text-[#6236f5]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Instant domain scanning with results generated in under 2 seconds using high-performance inference.</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-[#6236f5]/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6236f5]/20 transition-all">
              <Search className="text-[#6236f5]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Pattern Recognition</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our AI detects look-alike domains and subtle character variations used by attackers.</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-[#6236f5]/30 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#6236f5]/20 transition-all">
              <Lock className="text-[#6236f5]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Encrypted Privacy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Your search history is encrypted. We protect the analyst as much as the organization.</p>
          </div>
        </div>

        <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-b from-slate-900/50 to-transparent border border-white/5 flex flex-col items-center text-center">
          <ShieldAlert size={48} className="text-[#6236f5] mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-4">Zero Trust Architecture</h2>
          <p className="text-slate-400 max-w-xl text-sm leading-loose">
            In an era of sophisticated social engineering, PhishGuard provides the defensive layer needed to verify every link before you click. Stay ahead of the threats.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;