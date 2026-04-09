import React from 'react';
import { ShieldCheck, Users, GraduationCap, Target, Cpu, CheckCircle, ArrowDown } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Vaneeza",
      role: "Security Analyst & Developer",
      university: "Beaconhouse National University"
    },
    {
      name: "Sara",
      role: "AI Research & Developer",
      university: "Beaconhouse National University"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6236f5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#6236f5] mb-6">
            <Users size={14} />
            The Intelligence Team
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Meet the Developers</h1>
          <p className="text-slate-400">The minds behind the PhishGuard security engine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {team.map((member, index) => (
            <div key={index} className="group p-10 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] hover:border-[#6236f5]/40 transition-all text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <GraduationCap size={80} />
              </div>
              
              <div className="w-28 h-28 bg-gradient-to-tr from-[#6236f5] to-indigo-400 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-[#6236f5]/20 group-hover:scale-105 transition-transform">
                <span className="text-4xl font-bold text-white uppercase">{member.name.charAt(0)}</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-2 group-hover:text-[#6236f5] transition-colors">{member.name}</h3>
              <p className="text-[#6236f5] font-semibold tracking-wide text-sm mb-6 uppercase">{member.role}</p>
              
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800/50 rounded-full text-slate-300 border border-white/5">
                <GraduationCap size={16} className="text-[#6236f5]" />
                <span className="text-[10px] sm:text-xs font-bold tracking-widest">{member.university}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mb-24">
          <div className="w-px h-24 bg-gradient-to-b from-[#6236f5] to-transparent opacity-50" />
          <ArrowDown className="text-[#6236f5] animate-bounce mt-4" size={24} />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">About the Application</h2>
          <div className="w-24 h-1.5 bg-[#6236f5] mx-auto rounded-full mb-8" />
          <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
            PhishGuard is a high-performance security layer built to identify malicious intent 
            through deep neural analysis of URLs and domain structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {[
              { 
                icon: <Target />, 
                title: "Our Mission", 
                desc: "To provide real-time protection against social engineering attacks." 
              },
              { 
                icon: <Cpu />, 
                title: "Technology Stack", 
                desc: "Utilizing Large Language Models and custom datasets for 99.9% accuracy." 
              },
              { 
                icon: <CheckCircle />, 
                title: "Safety First", 
                desc: "Every scan is private, encrypted, and never stored as plain text." 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex-shrink-0 w-12 h-12 bg-[#6236f5]/20 rounded-2xl flex items-center justify-center text-[#6236f5]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/20 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] text-center border-l-[#6236f5]/40 border-l-4">
            <ShieldCheck size={80} className="text-[#6236f5] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(98,54,245,0.4)]" />
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Verified Protection</h2>
            <p className="text-slate-400 text-sm leading-loose">
              Our system continuously learns from the latest threat intelligence feeds to ensure 
              you are protected against tomorrow's threats, today.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;