import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Threat Scanner', path: '/threat-scan' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#020617]/90 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-[#6236f5] rounded-lg shadow-lg shadow-[#6236f5]/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Phish<span className="text-[#6236f5]">Guard</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[#6236f5] ${
                location.pathname === link.path ? 'text-[#6236f5]' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2.5 rounded-xl border border-red-500/20 transition-all text-sm font-bold"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#6236f5] hover:bg-[#4f2ac4] text-white px-8 py-2.5 rounded-xl shadow-lg shadow-[#6236f5]/20 transition-all text-sm font-bold flex items-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>

        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`md:hidden absolute w-full bg-[#020617] border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[500px] opacity-100 py-6' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${
                location.pathname === link.path ? 'text-[#6236f5]' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-full px-10 pt-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 text-red-400 py-4 rounded-2xl font-bold border border-red-500/20 flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#6236f5] text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-[#6236f5]/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;