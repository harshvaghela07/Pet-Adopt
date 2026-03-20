import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PetCard from '../components/PetCard';
import PetFilters from '../components/PetFilters';

export default function Home() {
  const [pets, setPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', species: '', breed: '', ageMin: '', ageMax: '' });

  const fetchPets = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.search) params.set('search', filters.search);
      if (filters.species) params.set('species', filters.species);
      if (filters.breed) params.set('breed', filters.breed);
      if (filters.ageMin) params.set('ageMin', filters.ageMin);
      if (filters.ageMax) params.set('ageMax', filters.ageMax);
      const { data } = await api.get(`/pets?${params}`);
      setPets(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(1);
  }, [filters]);

  useEffect(() => {
    api.get('/pets?status=adopted&limit=6').then(({ data }) => setAdoptedPets(data.data)).catch(() => {});
  }, []);

  const handlePageChange = (page) => fetchPets(page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 bg-warm-gradient rounded-3xl py-16 px-6 border border-orange-100">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-dark mb-4">
          Find Your Perfect Companion
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Browse adorable pets waiting for a loving home. Every adoption makes a difference.
        </p>
      </div>

      <PetFilters filters={filters} setFilters={setFilters} filterOptions={null} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-warm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-stone-500">No pets found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-subtle px-4 py-2 rounded-xl border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 text-stone-700"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-stone-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn-subtle px-4 py-2 rounded-xl border border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 text-stone-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {adoptedPets.length > 0 && (
        <section className="mt-16 pt-12 border-t border-orange-100">
          <h2 className="font-display text-2xl font-bold text-stone-800 mb-6">Recently Adopted</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {adoptedPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
