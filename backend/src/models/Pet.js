import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      trim: true,
      lowercase: true,
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [50, 'Age seems invalid'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adoptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

petSchema.index({ name: 'text', breed: 'text', species: 'text' });
petSchema.index({ species: 1, breed: 1, age: 1 });
petSchema.index({ status: 1 });

export default mongoose.model('Pet', petSchema);
