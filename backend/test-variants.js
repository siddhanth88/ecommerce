import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const testProduct = {
      name: 'Test Shirt ' + Date.now(),
      brand: 'Test Brand',
      price: 100,
      category: 'T-Shirts',
      description: 'Test description',
      sizes: ['S', 'M'],
      size_variants: {
        'S': { stock: 10, price: 90 },
        'M': { stock: 5, price: 110 }
      }
    };

    const product = await Product.create(testProduct);
    console.log('Product created with ID:', product._id);
    console.log('Price Range (Virtual):', product.price_range);
    console.log('Total Stock (Virtual):', product.total_stock);
    console.log('Available Sizes (Virtual):', product.available_sizes);
    
    const fetched = await Product.findById(product._id);
    console.log('Fetched Product size_variants type:', typeof fetched.size_variants);
    console.log('Fetched Product size_variants entries:', Array.from(fetched.size_variants.entries()));
    
    const pojo = fetched.toObject();
    console.log('POJO size_variants:', JSON.stringify(pojo.size_variants, null, 2));

    await Product.findByIdAndDelete(product._id);
    console.log('Test product deleted');
    
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
};

test();
