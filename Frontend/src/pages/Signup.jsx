import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Key phrases do not match.");
      return;
    }

    setLoading(true);
    const loadId = toast.loading('Registering analyst identity...');

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/signup', {
        user_name: formData.user_name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Registration successful.', { id: loadId });
        navigate('/login');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Registration failed.';
      toast.error(errorMsg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6236f5]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[450px] z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6236f5] rounded-2xl mb-6 shadow-xl shadow-[#6236f5]/20">
              <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Profile</h1>
            <p className="text-slate-400 mt-2 text-sm">Join the encrypted security network</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#6236f5] transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                  className="w-full bg-[#e6eeff] border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-[#6236f5]/20 transition-all placeholder:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="Vaneeza Rasool"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#6236f5] transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#e6eeff] border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-[#6236f5]/20 transition-all placeholder:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="vaneeza11@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Define Key Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#6236f5] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#e6eeff] border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-[#6236f5]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm Identity Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#6236f5] transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  disabled={loading}
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                  className="w-full bg-[#e6eeff] border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 outline-none focus:ring-4 focus:ring-[#6236f5]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#6236f5] hover:bg-[#4f2ac4] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#6236f5]/20 flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <>
                  Authorize Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm text-slate-400 hover:text-[#6236f5] transition-colors"
            >
              Already a member? <span className="text-[#6236f5] font-bold">Log In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;