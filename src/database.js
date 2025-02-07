import dotenv from 'dotenv';
import mongoose from 'mongoose';

console.log("🔍 Valor de MONGO_URI:", process.env.MONGO_URI); // Verificar si se carga la URI
console.log(typeof process.env.MONGO_URI);    
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
      }
    });
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB Atlas:", error);
    process.exit(1);
  }
};

// Exportar la función correctamente para usar en app.js
export default connectDB;
