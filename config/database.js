const mongoose = require('mongoose');

class DB {
  static #instance = null;
  static #isConnected = false;

  constructor() {
    // Prevent direct instantiation
    if (DB.#instance) {
      return DB.#instance;
    }

    DB.#instance = this;

    return this;
  }

  _dbString() {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultdb';
  }

  async connect() {
    if (DB.#isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      await mongoose.connect(this._dbString());
      DB.#isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
      throw error;
    }
  }

  async disconnect() {
    if (!DB.#isConnected) {
      // console.log('Database already disconnected');
      return;
    }

    try {
      await mongoose.disconnect();
      DB.#isConnected = false;
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Database disconnection failed:', error);
      throw error;
    }
  }

  async dropDB() {
    if (!DB.#isConnected) {
      throw new Error('Database not connected');
    }

    try {
      await mongoose.connection.dropDatabase();
      console.log('Database dropped successfully');
    } catch (error) {
      console.error('Database drop failed:', error);
      process.exit(1);
      throw error;
    }
  }

  get isConnected() {
    return DB.#isConnected && mongoose.connection.readyState === 1;
  }

  get connectionState() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[mongoose.connection.readyState] || 'unknown';
  }

  static getInstance() {
    if (!DB.#instance) {
      DB.#instance = new DB();
    }
    return DB.#instance;
  }

  // Static method to reset instance (useful for testing)
  static resetInstance() {
    DB.#instance = null;
    DB.#isConnected = false;
  }

  // Static convenience methods
  static async connect() {
    const instance = DB.getInstance();
    return await instance.connect();
  }

  static async disconnect() {
    const instance = DB.getInstance();
    return await instance.disconnect();
  }

  static async dropDB() {
    const instance = DB.getInstance();
    return await instance.dropDB();
  }

  static get isConnected() {
    return DB.#isConnected && mongoose.connection.readyState === 1;
  }
}

module.exports = DB;
