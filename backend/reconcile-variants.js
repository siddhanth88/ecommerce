import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const reconcile = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    for (const product of products) {
      let needsSave = false;
      
      // If product has sizes but no variants, populate them
      if (product.sizes && product.sizes.length > 0 && (!product.size_variants || product.size_variants.size === 0)) {
        product.size_variants = new Map();
        for (const size of product.sizes) {
          product.size_variants.set(size, {
            stock: product.stock || 0,
            price: product.price || 0
          });
        }
        console.log(`Populated variants for: ${product.name}`);
        needsSave = true;
      }

      if (needsSave) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Reconciliation complete. Updated ${updatedCount} products.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Reconciliation failed:', err);
    process.exit(1);
  }
};

reconcile();
