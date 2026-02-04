import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },

  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  category: {
    type: String,
    required: [true, 'Please provide category']
  },
  images: {
    type: [String],
    default: []
  },
  sizes: {
    type: [String],
    default: []
  },
  size_variants: {
    type: Map,
    of: {
      stock: { type: Number, default: 0, min: 0 },
      price: { type: Number, required: true, min: 0 }
    }
  },
  // New colorVariants structure - each color has its own images AND sizes/stock
  colorVariants: [{
    name: { type: String, required: true },       // e.g. "Red", "Blue"
    hexCode: { type: String, required: true },    // e.g. "#FF0000"
    images: [String],                              // Array of image URLs for this color
    isDefault: { type: Boolean, default: false },
    // Nested sizes for this specific color variant
    sizes: [{
      size: { type: String, required: true },
      stock: { type: Number, default: 0, min: 0 },
      price: { type: Number } // Optional override
    }]
  }],
  // Legacy fields kept for backward compatibility (computed in virtuals)
  colors: {
    type: [String],
    default: []
  },
  colorNames: {
    type: [String],
    default: []
  },
  // Category references for hierarchical categories
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  stock: {
    type: Number,
    required: [true, 'Please provide total stock quantity'],
    min: 0,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imagesData: [{
    buffer: Buffer,
    contentType: String
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      if (ret.size_variants && typeof ret.size_variants.get === 'function') {
        ret.size_variants = Object.fromEntries(ret.size_variants);
      }
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: (doc, ret) => {
      if (ret.size_variants && typeof ret.size_variants.get === 'function') {
        ret.size_variants = Object.fromEntries(ret.size_variants);
      }
      return ret;
    }
  }
});

// Virtual for price range
productSchema.virtual('price_range').get(function() {
  // Check new structure first
  if (this.colorVariants && this.colorVariants.some(c => c.sizes && c.sizes.length > 0)) {
     let prices = [];
     this.colorVariants.forEach(c => {
       if (c.sizes) {
         c.sizes.forEach(s => {
           if (s.price) prices.push(s.price);
           else prices.push(this.price); // Use base price if no override
         });
       }
     });
     if (prices.length === 0) return `₹${this.price}`;
     const min = Math.min(...prices);
     const max = Math.max(...prices);
     if (min === max) return `₹${min}`;
     return `₹${min} - ₹${max}`;
  }

  if (!this.size_variants) return `₹${this.price}`;
  
  const entries = this.size_variants instanceof Map 
    ? Array.from(this.size_variants.values()) 
    : Object.values(this.size_variants);

  if (entries.length === 0) {
    return `₹${this.price}`;
  }
  
  const prices = entries.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (minPrice === maxPrice) return `₹${minPrice}`;
  return `₹${minPrice} - ₹${maxPrice}`;
});

// Virtual for available sizes (stock > 0)
productSchema.virtual('available_sizes').get(function() {
  // Check new structure
  if (this.colorVariants && this.colorVariants.some(c => c.sizes && c.sizes.length > 0)) {
    const sizeSet = new Set();
    this.colorVariants.forEach(c => {
      if (c.sizes) {
        c.sizes.forEach(s => {
          if (s.stock > 0) sizeSet.add(s.size);
        });
      }
    });
    return Array.from(sizeSet);
  }

  if (!this.size_variants) return [];
  const available = [];
  
  if (this.size_variants instanceof Map) {
    for (const [size, variant] of this.size_variants.entries()) {
      if (variant.stock > 0) available.push(size);
    }
  } else {
    for (const [size, variant] of Object.entries(this.size_variants)) {
      if (variant.stock > 0) available.push(size);
    }
  }
  return available;
});

// Virtual for total stock
productSchema.virtual('total_stock').get(function() {
  // Check new structure first
  if (this.colorVariants && this.colorVariants.some(c => c.sizes && c.sizes.length > 0)) {
    let total = 0;
    this.colorVariants.forEach(c => {
      if (c.sizes) {
        c.sizes.forEach(s => {
          total += (s.stock || 0);
        });
      }
    });
    return total; // Return sum of all variant stocks
  }

  if (!this.size_variants) return this.stock;
  
  const entries = this.size_variants instanceof Map 
    ? Array.from(this.size_variants.values()) 
    : Object.values(this.size_variants);
    
  if (entries.length === 0) return this.stock;
  
  let total = 0;
  for (const variant of entries) {
    total += variant.stock;
  }
  return total;
});

// Virtual for default color (first with isDefault=true, or first color)
productSchema.virtual('defaultColor').get(function() {
  if (!this.colorVariants || this.colorVariants.length === 0) return null;
  const defaultVariant = this.colorVariants.find(c => c.isDefault);
  return defaultVariant || this.colorVariants[0];
});

// Virtual for default color's images
productSchema.virtual('defaultColorImages').get(function() {
  const defaultColor = this.defaultColor;
  if (!defaultColor) return this.images || [];
  return defaultColor.images?.length > 0 ? defaultColor.images : (this.images || []);
});

// Backward compatibility: compute colors array from colorVariants
productSchema.virtual('computedColors').get(function() {
  if (!this.colorVariants || this.colorVariants.length === 0) return this.colors || [];
  return this.colorVariants.map(cv => cv.hexCode);
});

// Backward compatibility: compute colorNames array from colorVariants
productSchema.virtual('computedColorNames').get(function() {
  if (!this.colorVariants || this.colorVariants.length === 0) return this.colorNames || [];
  return this.colorVariants.map(cv => cv.name);
});

// Validate colorVariants (1-6 colors max)
productSchema.path('colorVariants').validate(function(value) {
  if (!value) return true;
  return value.length <= 6;
}, 'Maximum 6 color variants allowed');

// Pre-save: ensure one default color if colorVariants exist
productSchema.pre('save', function(next) {
  if (this.colorVariants && this.colorVariants.length > 0) {
    const hasDefault = this.colorVariants.some(c => c.isDefault);
    if (!hasDefault) {
      this.colorVariants[0].isDefault = true;
    }
    // Sync legacy fields for backward compatibility
    this.colors = this.colorVariants.map(cv => cv.hexCode);
    this.colorNames = this.colorVariants.map(cv => cv.name);
  }
  next();
});

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ subCategoryId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
