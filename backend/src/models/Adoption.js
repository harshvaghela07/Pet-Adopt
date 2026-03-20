import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },
    adminNotes: {
      type: String,
      trim: true,
      select: false,
    },
  },
  { timestamps: true }
);

adoptionSchema.index({ user: 1 });
adoptionSchema.index({ pet: 1 });
adoptionSchema.index({ status: 1 });

adoptionSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const Adoption = mongoose.model('Adoption');
  const existing = await Adoption.findOne({
    pet: this.pet,
    user: this.user,
    status: 'pending',
  });
  if (existing) {
    const err = new Error('You already have a pending application for this pet');
    err.statusCode = 400;
    return next(err);
  }
  next();
});

export default mongoose.model('Adoption', adoptionSchema);
