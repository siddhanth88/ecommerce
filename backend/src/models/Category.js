import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1,  // 1=main (Men/Women/Kids), 2=sub (Clothing/Shoes), 3=leaf (T-Shirts)
    min: 1,
    max: 3
  },
  image: {
    type: String,
    default: ''
  },
  productsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Auto-generate slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\\s+/g, '-');
  }
  next();
});

// Compound index: name + parentId (searchable but not strictly unique to allow flexibility)
categorySchema.index({ name: 1, parentId: 1 });

// Index for fast tree queries
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
