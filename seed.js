const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 2999,
    originalPrice: 3999,
    category: 'electronics',
    brand: 'AudioTech',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Headphones', alt: 'Wireless Headphones' }
    ],
    stock: 50,
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '1 Year'
    },
    tags: ['wireless', 'bluetooth', 'noise-cancellation', 'premium'],
    isFeatured: true
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking, heart rate monitoring, GPS, and smartphone integration. Water-resistant design with 7-day battery life.',
    price: 4999,
    originalPrice: 6999,
    category: 'electronics',
    brand: 'TechWear',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Smart+Watch', alt: 'Smart Watch' }
    ],
    stock: 30,
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Compatibility': 'iOS & Android'
    },
    tags: ['smartwatch', 'fitness', 'health', 'gps'],
    isFeatured: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Breathable fabric, perfect for everyday wear.',
    price: 499,
    originalPrice: 799,
    category: 'clothing',
    brand: 'EcoWear',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=T-Shirt', alt: 'Cotton T-Shirt' }
    ],
    stock: 100,
    specifications: {
      'Material': '100% Organic Cotton',
      'Sizes': 'S, M, L, XL',
      'Care': 'Machine Washable',
      'Origin': 'Made in India'
    },
    tags: ['organic', 'cotton', 'sustainable', 'casual'],
    isFeatured: false
  },
  {
    name: 'JavaScript: The Complete Guide',
    description: 'Comprehensive book covering modern JavaScript from basics to advanced concepts. Perfect for beginners and experienced developers.',
    price: 599,
    originalPrice: 899,
    category: 'books',
    brand: 'TechBooks',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=JavaScript+Book', alt: 'JavaScript Book' }
    ],
    stock: 75,
    specifications: {
      'Pages': '650',
      'Language': 'English',
      'Format': 'Paperback',
      'ISBN': '978-1234567890'
    },
    tags: ['javascript', 'programming', 'web-development', 'education'],
    isFeatured: false
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick, non-slip yoga mat with alignment markers. Perfect for yoga, pilates, and floor exercises.',
    price: 899,
    originalPrice: 1299,
    category: 'sports',
    brand: 'FitGear',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Yoga+Mat', alt: 'Yoga Mat' }
    ],
    stock: 60,
    specifications: {
      'Thickness': '6mm',
      'Material': 'TPE',
      'Dimensions': '183cm x 61cm',
      'Weight': '1.2kg'
    },
    tags: ['yoga', 'fitness', 'exercise', 'non-slip'],
    isFeatured: true
  },
  {
    name: 'Smart Home Security Camera',
    description: 'HD security camera with night vision, motion detection, and two-way audio. Monitor your home remotely.',
    price: 1999,
    originalPrice: 2999,
    category: 'electronics',
    brand: 'SecureHome',
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Security+Camera', alt: 'Security Camera' }
    ],
    stock: 40,
    specifications: {
      'Resolution': '1080p HD',
      'Night Vision': '30ft',
      'Storage': 'Cloud & SD Card',
      'Power': 'USB powered'
    },
    tags: ['security', 'smart-home', 'camera', 'wireless'],
    isFeatured: true
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    mobile: '9876543210',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '9876543211',
    password: 'user123',
    role: 'user'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    
    // Display admin credentials
    console.log('\n=== Admin Credentials ===');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');
    console.log('\n=== User Credentials ===');
    console.log('Email: john@example.com');
    console.log('Password: user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();