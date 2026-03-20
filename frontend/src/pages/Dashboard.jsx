import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoptions/my').then(({ data }) => setApplications(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-orange-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">My Applications</h1>
      <p className="text-stone-600 mb-8">Track your adoption application status.</p>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-warm p-12 text-center border border-orange-100">
          <p className="text-stone-600 mb-4">You haven't applied to adopt any pets yet.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-warm">
            Browse Pets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow-warm p-6 border border-orange-100 flex flex-wrap md:flex-nowrap gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={app.pet?.imageUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop'}
                  alt={app.pet?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-lg text-stone-800">{app.pet?.name}</h3>
                <p className="text-sm text-stone-500 capitalize">{app.pet?.breed} • {app.pet?.species}</p>
                {app.message && <p className="text-sm text-stone-600 mt-1">{app.message}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[app.status]}`}>
                  {app.status}
                </span>
                <Link
                  to={`/pets/${app.pet?._id}`}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  View Pet
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
