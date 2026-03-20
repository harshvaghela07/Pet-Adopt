import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-warm-lg p-8 border border-orange-100">
          <h1 className="font-display text-2xl font-bold text-center text-stone-800 mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
              />
              <p className="text-xs text-stone-500 mt-1">At least 6 characters</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition shadow-warm"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-stone-600">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
