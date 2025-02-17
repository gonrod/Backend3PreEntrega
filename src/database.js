require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config'); // Importamos la configuración de entornos

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    });
    console.log(`Conectado exitosamente a MongoDB en modo ${config.env}`);
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
