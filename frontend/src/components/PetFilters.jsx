import { useState, useEffect } from 'react';
import api from '../services/api';

export default function PetFilters({ filters, setFilters, filterOptions }) {
  const [options, setOptions] = useState(filterOptions || { species: [], breeds: [] });

  useEffect(() => {
    if (!filterOptions) {
      api.get('/pets/filters').then(({ data }) => setOptions(data.data)).catch(() => {});
    }
  }, [filterOptions]);

  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <div className="bg-white rounded-2xl shadow-warm p-5 mb-8 border border-orange-100">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Name or breed..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-stone-700 mb-1">Species</label>
          <select
            value={filters.species}
            onChange={(e) => update('species', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
          >
            <option value="">All</option>
            {options.species?.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-stone-700 mb-1">Breed</label>
          <select
            value={filters.breed}
            onChange={(e) => update('breed', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
          >
            <option value="">All</option>
            {options.breeds?.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-stone-700 mb-1">Min Age</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.ageMin}
            onChange={(e) => update('ageMin', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-stone-700 mb-1">Max Age</label>
          <input
            type="number"
            min="0"
            placeholder="20"
            value={filters.ageMax}
            onChange={(e) => update('ageMax', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-warm-50/50"
          />
        </div>
        <button
          onClick={() => setFilters((f) => ({ ...f, search: '', species: '', breed: '', ageMin: '', ageMax: '' }))}
          className="btn-subtle px-4 py-2 text-sm font-medium text-stone-600 border border-orange-200 rounded-xl hover:bg-orange-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
