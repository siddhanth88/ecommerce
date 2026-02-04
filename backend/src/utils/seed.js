import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import connectDB from '../config/database.js';

dotenv.config();

// Hierarchical category structure - Myntra Style
const categoryHierarchy = [
  {
    name: 'MEN',
    level: 1,
    children: [
      {
        name: 'Clothing',
        level: 2,
        children: [
          { name: 'T-Shirts', level: 3 },
          { name: 'Casual Shirts', level: 3 },
          { name: 'Formal Shirts', level: 3 },
          { name: 'Jeans', level: 3 },
          { name: 'Trousers', level: 3 },
          { name: 'Shorts', level: 3 }
        ]
      },
      {
        name: 'Footwear',
        level: 2,
        children: [
          { name: 'Casual Shoes', level: 3 },
          { name: 'Formal Shoes', level: 3 },
          { name: 'Sneakers', level: 3 },
          { name: 'Sandals & Floaters', level: 3 }
        ]
      },
      {
        name: 'Accessories',
        level: 2,
        children: [
          { name: 'Watches', level: 3 },
          { name: 'Belts & Wallets', level: 3 },
          { name: 'Sunglasses', level: 3 }
        ]
      }
    ]
  },
  {
    name: 'WOMEN',
    level: 1,
    children: [
      {
        name: 'Ethnic Wear',
        level: 2,
        children: [
          { name: 'Kurtas & Suits', level: 3 },
          { name: 'Sarees', level: 3 },
          { name: 'Ethnic Dresses', level: 3 }
        ]
      },
      {
        name: 'Western Wear',
        level: 2,
        children: [
          { name: 'Dresses', level: 3 },
          { name: 'Tops & T-shirts', level: 3 },
          { name: 'Jeans & Jeggings', level: 3 },
          { name: 'Skirts & Shorts', level: 3 }
        ]
      },
      {
        name: 'Footwear',
        level: 2,
        children: [
          { name: 'Heels', level: 3 },
          { name: 'Flats', level: 3 },
          { name: 'Sneakers', level: 3 }
        ]
      },
      {
        name: 'Accessories',
        level: 2,
        children: [
          { name: 'Bags & Handbags', level: 3 },
          { name: 'Jewellery', level: 3 },
          { name: 'Sunglasses', level: 3 }
        ]
      }
    ]
  },
  {
    name: 'KIDS',
    level: 1,
    children: [
      {
        name: 'Boys Clothing',
        level: 2,
        children: [
          { name: 'T-Shirts', level: 3 },
          { name: 'Shirts', level: 3 },
          { name: 'Shorts & Jeans', level: 3 }
        ]
      },
      {
        name: 'Girls Clothing',
        level: 2,
        children: [
          { name: 'Dresses', level: 3 },
          { name: 'Tops & T-shirts', level: 3 },
          { name: 'Skirts', level: 3 }
        ]
      }
    ]
  },
  {
    name: 'HOME',
    level: 1,
    children: [
      {
        name: 'Bed Linen',
        level: 2,
        children: [
          { name: 'Bedsheets', level: 3 },
          { name: 'Blankets & Quilts', level: 3 }
        ]
      },
      {
        name: 'Decor',
        level: 2,
        children: [
          { name: 'Wall Decor', level: 3 },
          { name: 'Vases & Figurines', level: 3 }
        ]
      }
    ]
  },
  {
    name: 'BEAUTY',
    level: 1,
    children: [
      {
        name: 'Makeup',
        level: 2,
        children: [
          { name: 'Lipstick', level: 3 },
          { name: 'Nail Polish', level: 3 },
          { name: 'Eyeliner', level: 3 }
        ]
      },
      {
        name: 'Skincare',
        level: 2,
        children: [
          { name: 'Face Wash', level: 3 },
          { name: 'Moisturizer', level: 3 }
        ]
      }
    ]
  }
];


// Product data with colorVariants
const products = [
  {
    name: "Premium Cotton T-Shirt",
    price: 39.90,
    originalPrice: 59.90,
    discount: 33,
    category: "T-Shirts",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 50,
    description: "100% premium cotton t-shirt with a relaxed fit. Perfect for everyday wear with superior comfort and breathability.",
    tags: ["Best Seller", "New"],
    rating: 4.5,
    reviews: 128
  },
  {
    name: "Oversized Graphic Tee",
    
    price: 44.90,
    category: "T-Shirts",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["M", "L", "XL"],
    stock: 35,
    description: "Oversized fit graphic t-shirt made from soft cotton blend. Features unique street art design.",
    tags: ["Trending"],
    rating: 4.3,
    reviews: 89
  },
  {
    name: "Classic White Tee",
    
    price: 29.90,
    category: "T-Shirts",
    colorVariants: [
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 100,
    description: "Essential white t-shirt. A wardrobe staple made from premium cotton.",
    tags: ["Essential"],
    rating: 4.7,
    reviews: 256
  },
  {
    name: "Premium Pullover Hoodie",
    
    price: 89.90,
    originalPrice: 119.90,
    discount: 25,
    category: "Hoodies",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1542406775-ade58c52d2e4?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    description: "Premium heavyweight hoodie with fleece lining. Features adjustable drawstring hood and kangaroo pocket.",
    tags: ["Best Seller"],
    rating: 4.8,
    reviews: 342
  },
  {
    name: "Zip-Up Hoodie",
    
    price: 79.90,
    category: "Hoodies",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 28,
    description: "Full-zip hoodie with ribbed cuffs and hem. Perfect layering piece for any season.",
    tags: ["New"],
    rating: 4.4,
    reviews: 67
  },
  {
    name: "Leather Bomber Jacket",
    
    price: 299.00,
    originalPrice: 399.00,
    discount: 25,
    category: "Jackets",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Brown",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    description: "Genuine leather bomber jacket with quilted lining. Classic design with modern fit.",
    tags: ["Luxury", "Best Seller"],
    rating: 4.9,
    reviews: 178
  },
  {
    name: "Denim Jacket",
    
    price: 119.90,
    category: "Jackets",
    colorVariants: [
      {
        name: "Blue Denim",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black Denim",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    description: "Classic denim jacket with button closure. Timeless style that never goes out of fashion.",
    tags: ["Essential"],
    rating: 4.6,
    reviews: 203
  },
  {
    name: "Windbreaker Jacket",
    
    price: 89.90,
    originalPrice: 109.90,
    discount: 18,
    category: "Jackets",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1545594861-3bef43ff2fc8?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["M", "L", "XL"],
    stock: 32,
    description: "Lightweight windbreaker with water-resistant coating. Perfect for unpredictable weather.",
    tags: ["New"],
    rating: 4.2,
    reviews: 54
  },
  {
    name: "Cargo Pants",
    
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    category: "Pants",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Khaki",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 55,
    description: "Utility cargo pants with multiple pockets. Durable cotton twill construction.",
    tags: ["Trending", "Best Seller"],
    rating: 4.5,
    reviews: 167
  },
  {
    name: "Slim Fit Jeans",
    
    price: 69.90,
    category: "Pants",
    colorVariants: [
      {
        name: "Blue Denim",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    stock: 70,
    description: "Classic slim fit jeans with stretch denim. Comfortable all-day wear.",
    tags: ["Essential"],
    rating: 4.4,
    reviews: 289
  },
  {
    name: "Jogger Pants",
    
    price: 59.90,
    originalPrice: 79.90,
    discount: 25,
    category: "Pants",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 48,
    description: "Comfortable jogger pants with elastic waistband and cuffs. Perfect for casual wear.",
    tags: ["New"],
    rating: 4.3,
    reviews: 112
  },
  {
    name: "Chino Pants",
    
    price: 74.90,
    category: "Pants",
    colorVariants: [
      {
        name: "Khaki",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1624378441864-6eda7eac51cb?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    stock: 42,
    description: "Classic chino pants with a modern slim fit. Versatile for both casual and smart-casual occasions.",
    tags: ["Essential"],
    rating: 4.6,
    reviews: 198
  },
  {
    name: "Canvas Sneakers",
    
    price: 69.90,
    originalPrice: 89.90,
    discount: 22,
    category: "Shoes",
    colorVariants: [
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 60,
    description: "Classic canvas sneakers with rubber sole. Timeless design for everyday wear.",
    tags: ["Best Seller", "Essential"],
    rating: 4.7,
    reviews: 412
  },
  {
    name: "High-Top Sneakers",
    
    price: 99.90,
    category: "Shoes",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    stock: 38,
    description: "High-top sneakers with padded collar and tongue. Street-style essential.",
    tags: ["Trending"],
    rating: 4.5,
    reviews: 156
  },
  {
    name: "Running Shoes",
    
    price: 129.90,
    originalPrice: 159.90,
    discount: 19,
    category: "Shoes",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 44,
    description: "Performance running shoes with cushioned sole and breathable mesh upper.",
    tags: ["New"],
    rating: 4.8,
    reviews: 234
  },
  {
    name: "Leather Boots",
    
    price: 199.00,
    originalPrice: 249.00,
    discount: 20,
    category: "Shoes",
    colorVariants: [
      {
        name: "Brown",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["7", "8", "9", "10", "11"],
    stock: 22,
    description: "Premium leather boots with durable construction. Perfect for all seasons.",
    tags: ["Luxury"],
    rating: 4.9,
    reviews: 187
  },
  {
    name: "Baseball Cap",
    
    price: 29.90,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 80,
    description: "Classic baseball cap with adjustable strap. Embroidered logo detail.",
    tags: ["Essential", "New"],
    rating: 4.4,
    reviews: 145
  },
  {
    name: "Beanie Hat",
    
    price: 24.90,
    originalPrice: 34.90,
    discount: 29,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1580748142341-fc7c54d5ec47?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 65,
    description: "Warm knit beanie perfect for cold weather. Soft acrylic blend.",
    tags: ["Best Seller"],
    rating: 4.6,
    reviews: 203
  },
  {
    name: "Leather Belt",
    
    price: 49.90,
    category: "Accessories",
    colorVariants: [
      {
        name: "Brown",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1624222247344-550fb60583f2?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    description: "Genuine leather belt with metal buckle. Classic accessory for any outfit.",
    tags: ["Essential"],
    rating: 4.7,
    reviews: 167
  },
  {
    name: "Canvas Backpack",
    
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 35,
    description: "Durable canvas backpack with multiple compartments. Perfect for daily use.",
    tags: ["Trending"],
    rating: 4.5,
    reviews: 189
  },
  {
    name: "Sunglasses",
    
    price: 89.90,
    originalPrice: 119.90,
    discount: 25,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Tortoise",
        hexCode: "#78350F",
        images: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 42,
    description: "UV protection sunglasses with polarized lenses. Classic aviator style.",
    tags: ["Luxury"],
    rating: 4.8,
    reviews: 156
  },
  {
    name: "Wool Scarf",
    
    price: 39.90,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Gray",
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1584736286279-4c29e0e8a04b?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 55,
    description: "Soft wool scarf for cold weather. Lightweight and warm.",
    tags: ["New"],
    rating: 4.5,
    reviews: 98
  },
  {
    name: "Crossbody Bag",
    
    price: 59.90,
    originalPrice: 79.90,
    discount: 25,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 28,
    description: "Compact crossbody bag with adjustable strap. Perfect for essentials.",
    tags: ["Trending"],
    rating: 4.4,
    reviews: 134
  },
  {
    name: "Watch",
    
    price: 149.00,
    originalPrice: 199.00,
    discount: 25,
    category: "Accessories",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Silver",
        hexCode: "#C0C0C0",
        images: [
          "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["One Size"],
    stock: 18,
    description: "Minimalist watch with leather strap. Japanese quartz movement.",
    tags: ["Luxury", "Best Seller"],
    rating: 4.9,
    reviews: 267
  },
  // Women's Products
  {
    name: "Floral Summer Dress",
    
    price: 89.90,
    originalPrice: 119.90,
    discount: 25,
    category: "Dresses",
    colorVariants: [
      {
        name: "Floral Pink",
        hexCode: "#EC4899",
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Floral Blue",
        hexCode: "#3B82F6",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 35,
    description: "Beautiful floral summer dress perfect for warm weather occasions.",
    tags: ["Trending", "New"],
    rating: 4.7,
    reviews: 145
  },
  {
    name: "Elegant Blouse",
    
    price: 54.90,
    category: "Tops",
    colorVariants: [
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Blush",
        hexCode: "#FBCFE8",
        images: [
          "https://images.unsplash.com/photo-1551048632-562e275a9837?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 60,
    description: "Elegant blouse with delicate details. Perfect for office or casual wear.",
    tags: ["Essential"],
    rating: 4.5,
    reviews: 198
  },
  {
    name: "High-Waist Leggings",
    
    price: 44.90,
    category: "Leggings",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Navy",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1548515563-e2f6e4c8e4e8?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Burgundy",
        hexCode: "#7F1D1D",
        images: [
          "https://images.unsplash.com/photo-1573879541250-58ae8b322b40?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 80,
    description: "High-waist leggings with compression fit. Squat-proof and breathable.",
    tags: ["Best Seller"],
    rating: 4.8,
    reviews: 324
  },
  {
    name: "Stiletto Heels",
    
    price: 129.00,
    originalPrice: 159.00,
    discount: 19,
    category: "Heels",
    colorVariants: [
      {
        name: "Black",
        hexCode: "#000000",
        images: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Nude",
        hexCode: "#D4A373",
        images: [
          "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["5", "6", "7", "8", "9", "10"],
    stock: 25,
    description: "Elegant stiletto heels for special occasions. Premium leather finish.",
    tags: ["Luxury"],
    rating: 4.6,
    reviews: 89
  },
  // Kids Products
  {
    name: "Kids Graphic T-Shirt",
    
    price: 19.90,
    category: "T-Shirts",
    colorVariants: [
      {
        name: "Blue",
        hexCode: "#3B82F6",
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Red",
        hexCode: "#DC2626",
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "Green",
        hexCode: "#16A34A",
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["4", "6", "8", "10", "12"],
    stock: 100,
    description: "Fun graphic t-shirt for kids with playful designs.",
    tags: ["New"],
    rating: 4.7,
    reviews: 156
  },
  {
    name: "Boys Denim Shorts",
    
    price: 29.90,
    category: "Shorts",
    colorVariants: [
      {
        name: "Blue Denim",
        hexCode: "#1E3A8A",
        images: [
          "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Light Wash",
        hexCode: "#60A5FA",
        images: [
          "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["4", "6", "8", "10", "12"],
    stock: 65,
    description: "Comfortable denim shorts for active boys. Durable construction.",
    tags: ["Essential"],
    rating: 4.5,
    reviews: 87
  },
  {
    name: "Girls Party Dress",
    
    price: 49.90,
    originalPrice: 69.90,
    discount: 29,
    category: "Dresses",
    colorVariants: [
      {
        name: "Pink",
        hexCode: "#EC4899",
        images: [
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&h=1000&fit=crop"
        ],
        isDefault: true
      },
      {
        name: "Purple",
        hexCode: "#8B5CF6",
        images: [
          "https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=800&h=1000&fit=crop"
        ]
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&h=1000&fit=crop"
        ]
      }
    ],
    sizes: ["4", "6", "8", "10"],
    stock: 40,
    description: "Beautiful party dress for little girls. Perfect for special occasions.",
    tags: ["Trending"],
    rating: 4.8,
    reviews: 112
  }
];

// Legacy flat categories for backward compatibility
const legacyCategories = [
  "T-Shirts",
  "Hoodies",
  "Jackets",
  "Pants",
  "Shoes",
  "Accessories",
  "Dresses",
  "Tops",
  "Leggings",
  "Heels",
  "Shorts"
];

// Helper to create hierarchical categories and store them for lookup
const seedCategoryTree = async (categories, parentId = null) => {
  const created = [];
  for (const cat of categories) {
    const categoryDoc = await Category.create({
      name: cat.name,
      parentId: parentId,
      level: cat.level,
      slug: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    
    created.push(categoryDoc);
    
    if (cat.children && cat.children.length > 0) {
      const children = await seedCategoryTree(cat.children, categoryDoc._id);
      created.push(...children);
    }
  }
  return created;
};


const mapCategory = (legacyCategory, allCategories) => {
    // Map generic legacy names to new structure
    const categoryMapping = {
       'T-Shirts': { main: 'MEN', sub: 'Clothing', leaf: 'T-Shirts' },
       'Shirts': { main: 'MEN', sub: 'Clothing', leaf: 'Casual Shirts' },
       'Jeans': { main: 'MEN', sub: 'Clothing', leaf: 'Jeans' },
       'Pants': { main: 'MEN', sub: 'Clothing', leaf: 'Trousers' },
       'Jackets': { main: 'MEN', sub: 'Clothing', leaf: 'Trousers' }, // Defaulting jackets to trousers or clothing L2
       'Hoodies': { main: 'MEN', sub: 'Clothing', leaf: 'T-Shirts' }, 
       'Dresses': { main: 'WOMEN', sub: 'Western Wear', leaf: 'Dresses' },
       'Tops': { main: 'WOMEN', sub: 'Western Wear', leaf: 'Tops & T-shirts' },
       'Leggings': { main: 'WOMEN', sub: 'Western Wear', leaf: 'Jeans & Jeggings' },
       'Heels': { main: 'WOMEN', sub: 'Footwear', leaf: 'Heels' }, 
       'Shoes': { main: 'MEN', sub: 'Footwear', leaf: 'Sneakers' },
       'Accessories': { main: 'MEN', sub: 'Accessories', leaf: 'Watches' }
    };

    const mapping = categoryMapping[legacyCategory];
    
    // Default to Men -> Clothing -> T-shirts if no map
    let mainCategory = allCategories.find(c => c.name === 'MEN' && c.level === 1);
    let subCategory = null;

    if (mapping) {
        const foundMain = allCategories.find(c => c.name === mapping.main && c.level === 1);
        if (foundMain) mainCategory = foundMain;
        
        // Find leaf category (level 3)
        subCategory = allCategories.find(c => 
            c.level === 3 && 
            c.name === mapping.leaf &&
            c.parentId?.toString() === allCategories.find(sub => 
                sub.name === mapping.sub && 
                sub.parentId?.toString() === mainCategory._id.toString()
            )?._id.toString()
        );
    }
    
    // Fallback: Find any leaf under main
    if (!subCategory) {
        const l2 = allCategories.find(c => c.parentId?.toString() === mainCategory._id.toString());
        if (l2) {
             subCategory = allCategories.find(c => c.parentId?.toString() === l2._id.toString());
        }
    }

    return { 
        categoryId: mainCategory ? mainCategory._id : null, 
        subCategoryId: subCategory ? subCategory._id : null,
        category: legacyCategory // Legacy String
    };
};


const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    try {
       await Category.collection.dropIndexes();
    } catch(e) {
       console.log('No indexes to drop or drop failed (non-fatal)');
    }
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log('👤 Creating users...');
    await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await User.create({
      name: 'Test User',
      email: 'user@ecommerce.com',
      password: 'user123',
      role: 'user',
      isVerified: true
    });

    console.log('📦 Creating hierarchical categories...');
    const allCategories = await seedCategoryTree(categoryHierarchy);

    console.log(`Created ${allCategories.length} categories.`);

    console.log('🛍️  Creating products...');
    for (const productData of products) {
       // Distribute stock
       if (productData.colorVariants) {
         productData.colorVariants = productData.colorVariants.map(v => ({
           ...v,
           sizes: productData.sizes.map(s => ({
             size: s,
             stock: Math.floor(productData.stock / (productData.sizes.length * productData.colorVariants.length)) + 5,
             price: productData.price 
           }))
         }));
       }

       const { categoryId, subCategoryId, category } = mapCategory(productData.category, allCategories);

       await Product.create({
          ...productData,
          categoryId,
          subCategoryId,
          category
       });
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
