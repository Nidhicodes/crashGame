const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes
    await createIndexes();
    
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const { User, Game, UserGameHistory, Leaderboard } = require('../models');
    
    // User indexes
    await User.collection.createIndex({ walletAddress: 1 }, { unique: true });
    await User.collection.createIndex({ 'stats.totalWinnings': -1 });
    await User.collection.createIndex({ 'stats.winRate': -1 });
    
    // Game indexes
    await Game.collection.createIndex({ endTime: -1 });
    await Game.collection.createIndex({ gameId: 1 }, { unique: true });
    
    // UserGameHistory indexes
    await UserGameHistory.collection.createIndex({ walletAddress: 1, timestamp: -1 });
    await UserGameHistory.collection.createIndex({ gameId: 1 });
    
    // Leaderboard indexes
    await Leaderboard.collection.createIndex({ type: 1, period: 1 }, { unique: true });
    
    console.log('📊 Database indexes created successfully');
  } catch (error) {
    console.error('Index creation failed:', error.message);
  }
};

module.exports = connectDB;