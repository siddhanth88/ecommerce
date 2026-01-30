import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
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
  colors: {
    type: [String],
    default: []
  },
  colorNames: {
    type: [String],
    default: []
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

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
