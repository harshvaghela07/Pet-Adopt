import Pet from '../models/Pet.js';
import Adoption from '../models/Adoption.js';

const buildQuery = (filters) => {
  const query = {};
  if (filters.status && filters.status !== 'all') query.status = filters.status;
  else if (!filters.isAdmin) query.status = 'available';
  if (filters.species) query.species = new RegExp(filters.species, 'i');
  if (filters.breed) query.breed = new RegExp(filters.breed, 'i');
  if (filters.ageMin != null) query.age = { ...query.age, $gte: Number(filters.ageMin) };
  if (filters.ageMax != null) query.age = { ...query.age, $lte: Number(filters.ageMax) };
  if (filters.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { breed: new RegExp(filters.search, 'i') },
      { species: new RegExp(filters.search, 'i') },
    ];
  }
  return query;
};

export const getPets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const filters = {
      search: req.query.search,
      species: req.query.species,
      breed: req.query.breed,
      ageMin: req.query.ageMin,
      ageMax: req.query.ageMax,
      status: (req.user?.role === 'admin' || req.query.status === 'adopted') ? req.query.status : undefined,
      isAdmin: req.user?.role === 'admin',
    };
    const query = buildQuery(filters);
    const [pets, total] = await Promise.all([
      Pet.find(query).populate('adoptedBy', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Pet.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: pets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('adoptedBy', 'name');
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.status && update.status !== 'adopted') {
      update.adoptedBy = null;
      update.adoptedAt = null;
    }
    const pet = await Pet.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    await Adoption.deleteMany({ pet: req.params.id });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const getSpeciesAndBreeds = async (req, res, next) => {
  try {
    const [species, breeds] = await Promise.all([
      Pet.distinct('species'),
      Pet.distinct('breed'),
    ]);
    res.json({ success: true, data: { species, breeds } });
  } catch (error) {
    next(error);
  }
};
