import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database.js'; // Importa la conexión



const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB antes de iniciar el servidor
connectDB().then(() => {
  app.use(express.json());
  app.use(cookieParser());

  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}).catch((error) => {
  console.error("❌ No se pudo iniciar el servidor debido a un error en la conexión con la base de datos", error);
});
