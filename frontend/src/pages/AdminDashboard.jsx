import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PetFilters from '../components/PetFilters';
import PetForm from '../components/PetForm';
import UserForm from '../components/UserForm';
import ApplicationList from '../components/ApplicationList';

const TABS = [
  { id: 'Pets', label: 'Pets', activeClass: 'bg-emerald-600 text-white shadow-md', inactiveClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' },
  { id: 'Applications', label: 'Applications', activeClass: 'bg-emerald-600 text-white shadow-md', inactiveClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' },
  { id: 'Users', label: 'Users', activeClass: 'bg-emerald-600 text-white shadow-md', inactiveClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' },
];
const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'adopted', label: 'Adopted' },
];

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState('Pets');
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [filterOptions, setFilterOptions] = useState({ species: [], breeds: [] });
  const [filters, setFilters] = useState({ search: '', species: '', breed: '', ageMin: '', ageMax: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [editingPet, setEditingPet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPets = async (page = 1) => {
    const params = new URLSearchParams({ page, limit: 12 });
    if (filters.search) params.set('search', filters.search);
    if (filters.species) params.set('species', filters.species);
    if (filters.breed) params.set('breed', filters.breed);
    if (filters.ageMin) params.set('ageMin', filters.ageMin);
    if (filters.ageMax) params.set('ageMax', filters.ageMax);
    if (filters.status) params.set('status', filters.status);
    const { data } = await api.get(`/pets?${params}`);
    setPets(data.data);
    setPagination(data.pagination);
  };

  const fetchApplications = () => api.get('/adoptions').then(({ data }) => setApplications(data.data));

  const fetchUsers = () => {
    const params = userSearch ? `?search=${encodeURIComponent(userSearch)}` : '';
    return api.get(`/users${params}`).then(({ data }) => setUsers(data.data));
  };

  const fetchFilters = () => api.get('/pets/filters').then(({ data }) => setFilterOptions(data.data));

  useEffect(() => {
    if (tab === 'Pets') {
      setLoading(true);
      fetchPets(1).then(() => setLoading(false));
      fetchFilters();
    } else if (tab === 'Applications') {
      setLoading(true);
      fetchApplications().finally(() => setLoading(false));
    } else if (tab === 'Users') {
      setLoading(true);
      fetchUsers().finally(() => setLoading(false));
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'Users') fetchUsers();
  }, [userSearch]);

  useEffect(() => {
    if (tab === 'Pets') fetchPets(1);
  }, [filters]);

  const handlePetSaved = () => {
    setShowForm(false);
    setEditingPet(null);
    fetchPets(pagination.page);
    fetchFilters();
  };

  const handlePetEdit = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handlePetDelete = async (id) => {
    if (!confirm('Delete this pet?')) return;
    await api.delete(`/pets/${id}`);
    fetchPets(pagination.page);
  };

  const handleApplicationUpdated = () => fetchApplications();

  const handleUserDelete = async (id) => {
    if (!confirm('Delete this user? Their adoption applications will also be removed.')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-8">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map(({ id, label, activeClass, inactiveClass }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${tab === id ? activeClass : inactiveClass}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'Pets' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => { setEditingPet(null); setShowForm(true); }}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-warm"
            >
              Add Pet
            </button>
          </div>
          <PetFilters filters={filters} setFilters={setFilters} filterOptions={filterOptions} />
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-stone-700 w-full mb-1">Status:</span>
            {STATUS_TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters((f) => ({ ...f, status: value }))}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  filters.status === value ? 'bg-primary text-white shadow-warm' : 'bg-orange-50 text-stone-600 hover:bg-orange-100 border border-orange-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'Pets' && showForm && (
        <PetForm
          pet={editingPet}
          onSave={handlePetSaved}
          onCancel={() => { setShowForm(false); setEditingPet(null); }}
          speciesOptions={filterOptions.species}
          breedOptions={filterOptions.breeds}
        />
      )}

      {tab === 'Pets' && !showForm && (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-orange-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div key={pet._id} className="bg-white rounded-2xl shadow-warm p-4 border border-orange-100">
                  <div className="flex gap-4">
                    <img
                      src={pet.imageUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop'}
                      alt={pet.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800">{pet.name}</h3>
                      <p className="text-sm text-stone-500 capitalize">{pet.breed} • {pet.species}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        pet.status === 'available' ? 'bg-emerald-100 text-emerald-800' : pet.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {pet.status}
                      </span>
                      {pet.status === 'adopted' && (pet.adoptedBy || pet.adoptedAt) && (
                        <p className="text-xs text-stone-600 mt-1">
                          {pet.adoptedBy?.name && `By ${pet.adoptedBy.name}`}
                          {pet.adoptedAt && ` • ${new Date(pet.adoptedAt).toLocaleDateString()}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handlePetEdit(pet)}
                      className="btn-subtle flex-1 py-2 text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePetDelete(pet._id)}
                      className="btn-subtle flex-1 py-2 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => fetchPets(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn-subtle px-4 py-2 rounded-xl border border-orange-200 text-stone-700 hover:bg-orange-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-stone-600">Page {pagination.page} of {pagination.pages}</span>
                <button
                  onClick={() => fetchPets(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="btn-subtle px-4 py-2 rounded-xl border border-orange-200 text-stone-700 hover:bg-orange-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )
      )}

      {tab === 'Applications' && (
        <ApplicationList applications={applications} loading={loading} onUpdate={handleApplicationUpdated} />
      )}

      {tab === 'Users' && showUserForm && (
        <UserForm onSave={() => { setShowUserForm(false); fetchUsers(); }} onCancel={() => setShowUserForm(false)} />
      )}

      {tab === 'Users' && (
        <div>
          <div className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-primary bg-warm-50/50"
            />
            <button
              onClick={() => setShowUserForm(true)}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark shadow-warm"
            >
              Add User
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-orange-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-warm border border-orange-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">Role</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-stone-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-orange-50/50">
                      <td className="px-4 py-3 text-stone-800 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-stone-600">{u.email}</td>
                      <td className="px-4 py-3">
                        {u._id === currentUser?._id ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-stone-100 text-stone-600'}`}>
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                            className="text-sm px-2 py-1 rounded-lg border border-orange-200 focus:ring-2 focus:ring-primary"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleUserDelete(u._id)}
                          disabled={u._id === currentUser?._id}
                          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="px-4 py-8 text-center text-stone-500">No users found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
