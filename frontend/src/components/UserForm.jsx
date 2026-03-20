import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function UserForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users', form);
      toast.success('User created');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-warm-lg w-[min(560px,90vw)] aspect-[4/3] max-h-[90vh] overflow-y-auto border border-orange-100">
        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-stone-800 mb-4">Add User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
              <p className="text-xs text-stone-500 mt-1">At least 6 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-subtle flex-1 py-2 border-2 border-orange-200 rounded-xl hover:bg-orange-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 shadow-warm"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
