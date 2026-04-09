import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowUp, Globe, MessageSquare, Share2 } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 px-6 relative overflow-hidden font-sans">
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#6236f5]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="p-2 bg-[#6236f5] rounded-lg shadow-lg shadow-[#6236f5]/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Phish<span className="text-[#6236f5]">Guard</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Advanced AI-driven phishing detection system designed to secure your digital footprint and identify malicious domains in real-time.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-[#6236f5] hover:bg-[#6236f5]/10 transition-all">
              <Globe size={18} />
            </a>
            <a href="#" className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-[#6236f5] hover:bg-[#6236f5]/10 transition-all">
              <MessageSquare size={18} />
            </a>
            <a href="#" className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-[#6236f5] hover:bg-[#6236f5]/10 transition-all">
              <Share2 size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-slate-400 hover:text-[#6236f5] text-sm transition-colors">Home</Link></li>
            <li><Link to="/threat-scan" className="text-slate-400 hover:text-[#6236f5] text-sm transition-colors">Threat Scanner</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-slate-400 hover:text-[#6236f5] text-sm transition-colors">About Us</Link></li>
            <li><a href="#" className="text-slate-400 hover:text-[#6236f5] text-sm transition-colors">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <Mail size={16} className="text-[#6236f5]" />
              <span>vaneezarasool7@gmail.com</span>
            </div>
            <div className="mt-6 p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-white font-bold uppercase">Systems Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} PhishGuard Security. All rights reserved.
        </p>
        
        <button 
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          BACK TO TOP
          <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#6236f5] transition-all">
            <ArrowUp size={14} />
          </div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;