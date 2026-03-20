import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = (
    <>
      {user ? (
        user.role === 'admin' ? (
          <>
            <Link to="/admin" className="text-stone-600 hover:text-primary transition py-2 md:py-0" onClick={() => setMobileOpen(false)}>Admin</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition w-full md:w-auto text-left"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-stone-600 hover:text-primary transition py-2 md:py-0" onClick={() => setMobileOpen(false)}>Browse Pets</Link>
            <Link to="/dashboard" className="text-stone-600 hover:text-primary transition py-2 md:py-0" onClick={() => setMobileOpen(false)}>My Applications</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition w-full md:w-auto text-left"
            >
              Logout
            </button>
          </>
        )
      ) : (
        <>
          <Link to="/" className="text-stone-600 hover:text-primary transition py-2 md:py-0" onClick={() => setMobileOpen(false)}>Browse Pets</Link>
          <Link to="/login" className="text-stone-600 hover:text-primary transition py-2 md:py-0" onClick={() => setMobileOpen(false)}>Login</Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:text-white rounded-xl hover:bg-primary-dark transition w-full md:w-auto text-center shadow-warm"
            onClick={() => setMobileOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-warm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-display font-bold text-xl text-primary">PetAdopt</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks}
          </div>

          <button
            className="btn-subtle md:hidden p-2 rounded-xl hover:bg-orange-50 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 flex flex-col gap-2 border-t border-orange-100">
            {navLinks}
          </div>
        )}
      </div>
    </nav>
  );
}
