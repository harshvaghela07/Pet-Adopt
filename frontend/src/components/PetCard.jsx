import { Link } from 'react-router-dom';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop';

export default function PetCard({ pet }) {
  const img = pet.imageUrl || PLACEHOLDER_IMG;
  const statusColors = { available: 'bg-emerald-100 text-emerald-800', pending: 'bg-amber-100 text-amber-800', adopted: 'bg-stone-200 text-stone-700' };

  return (
    <Link
      to={`/pets/${pet._id}`}
      className="group bg-white rounded-2xl shadow-warm overflow-hidden hover:shadow-warm-lg transition-all duration-300 border border-orange-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold capitalize shadow-sm ${statusColors[pet.status] || 'bg-stone-100'}`}>
          {pet.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-stone-800 group-hover:text-primary transition">
          {pet.name}
        </h3>
        <p className="text-sm text-gray-500 capitalize">{pet.breed} • {pet.species}</p>
        <p className="text-sm text-gray-600 mt-1">{pet.age} year{pet.age !== 1 ? 's' : ''} old</p>
        {pet.status === 'adopted' && pet.adoptedBy && (
          <p className="text-xs text-gray-500 mt-2">
            Adopted by {pet.adoptedBy.name}
            {pet.adoptedAt && ` on ${new Date(pet.adoptedAt).toLocaleDateString()}`}
          </p>
        )}
      </div>
    </Link>
  );
}
