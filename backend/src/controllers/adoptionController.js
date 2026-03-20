import Adoption from '../models/Adoption.js';
import Pet from '../models/Pet.js';

export const applyToAdopt = async (req, res, next) => {
  try {
    const { petId, message } = req.body;
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    if (pet.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Pet is not available for adoption' });
    }
    const adoption = await Adoption.create({
      pet: petId,
      user: req.user._id,
      message: message || undefined,
    });
    await adoption.populate('pet');
    res.status(201).json({ success: true, data: adoption });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Adoption.find({ user: req.user._id })
      .populate('pet')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};
    const applications = await Adoption.find(query)
      .populate('pet')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const adoption = await Adoption.findById(req.params.id).populate('pet').populate('user', 'name email');
    if (!adoption) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (adoption.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Application already processed' });
    }
    adoption.status = status;
    adoption.adminNotes = req.body.adminNotes;
    await adoption.save();
    if (status === 'approved') {
      const userId = adoption.user?._id || adoption.user;
      await Pet.findByIdAndUpdate(adoption.pet._id, {
        status: 'adopted',
        adoptedBy: userId,
        adoptedAt: new Date(),
      });
    } else {
      await Pet.findByIdAndUpdate(adoption.pet._id, {
        status: 'available',
        adoptedBy: null,
        adoptedAt: null,
      });
    }
    await adoption.populate('user', 'name email');
    res.json({ success: true, data: adoption });
  } catch (error) {
    next(error);
  }
};
