import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop';

export default function PetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    api.get(`/pets/${id}`).then(({ data }) => setPet(data.data)).catch(() => setPet(null)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && id) {
      api.get('/adoptions/my').then(({ data }) => {
        const applied = data.data?.some((a) => a.pet?._id === id || a.pet === id);
        setHasApplied(!!applied);
      }).catch(() => {});
    }
  }, [user, id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      return;
    }
    setApplying(true);
    try {
      await api.post('/adoptions/apply', { petId: id, message });
      setHasApplied(true);
      setMessage('');
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse bg-white rounded-2xl shadow-warm overflow-hidden">
          <div className="h-80 bg-orange-100" />
          <div className="p-8 space-y-4">
            <div className="h-8 bg-orange-100 rounded-xl w-1/3" />
            <div className="h-4 bg-orange-100 rounded-xl w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-stone-500">Pet not found.</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">Back to listing</Link>
      </div>
    );
  }

  const img = pet.imageUrl || PLACEHOLDER_IMG;
  const canApply = user && pet.status === 'available' && !hasApplied;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-warm-lg overflow-hidden border border-orange-100">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-96">
            <img src={img} alt={pet.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize mb-4 ${
                pet.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                pet.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
              }`}>
                {pet.status}
              </span>
              <h1 className="font-display text-3xl font-bold text-stone-800">{pet.name}</h1>
              <p className="text-stone-600 mt-2 capitalize">{pet.breed} • {pet.species}</p>
              <p className="text-stone-500 mt-1">{pet.age} year{pet.age !== 1 ? 's' : ''} old</p>
              {pet.description && (
                <p className="mt-4 text-stone-600">{pet.description}</p>
              )}
            </div>

            {user && pet.status === 'available' && hasApplied && (
              <button
                type="button"
                disabled
                className="mt-6 w-full py-3 bg-stone-300 text-stone-500 font-semibold rounded-xl cursor-not-allowed"
              >
                Applied
              </button>
            )}

            {canApply && (
              <form onSubmit={handleApply} className="mt-6 space-y-3">
                <textarea
                  placeholder="Why would you like to adopt this pet? (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-warm-50/50"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition shadow-warm"
                >
                  {applying ? 'Submitting...' : 'Apply to Adopt'}
                </button>
              </form>
            )}

            {pet.status === 'adopted' && (pet.adoptedBy || pet.adoptedAt) && (
              <div className="mt-4 p-4 bg-warm-50 rounded-xl border border-orange-100">
                <h4 className="font-semibold text-stone-800 mb-2">Adoption Details</h4>
                {pet.adoptedBy && <p className="text-stone-600">Adopted by <span className="font-medium">{pet.adoptedBy.name}</span></p>}
                {pet.adoptedAt && <p className="text-stone-600 mt-1">Date: {new Date(pet.adoptedAt).toLocaleDateString()}</p>}
              </div>
            )}

            {user && pet.status !== 'available' && !(pet.status === 'adopted') && (
              <p className="text-stone-500 mt-4">This pet is not available for adoption.</p>
            )}

            {!user && (
              <p className="mt-4 text-stone-600">
                <Link to="/login" className="text-primary font-medium hover:underline">Login</Link> or{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">Register</Link> to apply for adoption.
              </p>
            )}
          </div>
        </div>
      </div>
      <Link to="/" className="inline-block mt-6 text-primary hover:underline">← Back to all pets</Link>
    </div>
  );
}
