const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Try different MongoDB connection methods
    let conn;
    
    if (process.env.MONGODB_URI.includes('mongodb+srv')) {
      // MongoDB Atlas connection
      conn = await mongoose.connect(process.env.MONGODB_URI);
    } else {
      // Local MongoDB connection with fallback options
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    }
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Test database operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length} found`);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 MongoDB Fix Options:');
      console.log('1. Start MongoDB service: net start MongoDB');
      console.log('2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
      console.log('3. Or install MongoDB: https://www.mongodb.com/try/download/community');
    }
    
    // Don't exit process for development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n⚠️  Continuing without database for testing...');
      return;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;