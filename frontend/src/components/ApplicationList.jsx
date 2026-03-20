import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ApplicationList({ applications, loading, onUpdate }) {
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const handleStatus = async (id, status) => {
    setProcessing(id);
    try {
      await api.put(`/adoptions/${id}/status`, { status });
      toast.success(`Application ${status}`);
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-orange-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return <p className="text-stone-500">No adoption applications yet.</p>;
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold capitalize ${
              filter === f ? 'bg-primary text-white shadow-warm' : 'bg-orange-50 text-stone-600 hover:bg-orange-100 border border-orange-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-2xl shadow-warm p-6 border border-orange-100"
          >
            <div className="flex flex-wrap gap-4 items-start justify-between">
              <div className="flex gap-4">
                <img
                  src={app.pet?.imageUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop'}
                  alt={app.pet?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-stone-800">{app.pet?.name}</h3>
                  <p className="text-sm text-stone-500 capitalize">{app.pet?.breed} • {app.pet?.species}</p>
                  <p className="text-sm text-stone-600 mt-1">
                    Applicant: {app.user?.name} ({app.user?.email})
                  </p>
                  {app.message && <p className="text-sm text-stone-500 mt-1 italic">"{app.message}"</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[app.status]}`}>
                  {app.status}
                </span>
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatus(app._id, 'approved')}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(app._id, 'rejected')}
                      disabled={processing === app._id}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
