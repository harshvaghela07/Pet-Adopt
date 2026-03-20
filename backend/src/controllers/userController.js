import User from '../models/User.js';
import Adoption from '../models/Adoption.js';

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role: role || 'user' });
    const data = user.toObject();
    delete data.password;
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search;
    const query = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await Adoption.deleteMany({ user: id });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
