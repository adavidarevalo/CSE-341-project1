const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

let isConnected = false;

const connectToDb = (callback) => {
  if (isConnected) return callback();
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      isConnected = true;
      callback();
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!isConnected) {
    throw Error('Database not initialized');
  }
  return mongoose.connection;
};

module.exports = { connectToDb, getDb };
