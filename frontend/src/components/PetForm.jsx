import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function PetForm({ pet, onSave, onCancel, speciesOptions = [], breedOptions = [] }) {
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    imageUrl: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        description: pet.description || '',
        imageUrl: pet.imageUrl || '',
        status: pet.status,
      });
    }
  }, [pet]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, age: Number(form.age) };
      if (pet) await api.put(`/pets/${pet._id}`, payload);
      else await api.post('/pets', payload);
      toast.success(pet ? 'Pet updated' : 'Pet added');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-warm-lg w-[min(560px,90vw)] aspect-[4/3] max-h-[90vh] overflow-y-auto border border-orange-100">
        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-stone-800 mb-4">{pet ? 'Edit Pet' : 'Add Pet'}</h2>
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
              <label className="block text-sm font-medium text-stone-700 mb-1">Species *</label>
              <input
                type="text"
                list="species-list"
                required
                value={form.species}
                onChange={(e) => update('species', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
              <datalist id="species-list">
                {speciesOptions.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Breed *</label>
              <input
                type="text"
                list="breed-list"
                required
                value={form.breed}
                onChange={(e) => update('breed', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
              <datalist id="breed-list">
                {breedOptions.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Age (years) *</label>
              <input
                type="number"
                required
                min="0"
                max="50"
                value={form.age}
                onChange={(e) => update('age', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
