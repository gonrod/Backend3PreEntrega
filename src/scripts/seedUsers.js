const mongoose = require("mongoose");
const UserModel = require("../models/user.models.js");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = async () => {
    try {
        // Conexión a MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB");

        // Datos de ejemplo
        const users = [
            { first_name: "John", last_name: "Doe", email: "john@example.com", age: 30, password: "password123" },
            { first_name: "Jane", last_name: "Doe", email: "jane@example.com", age: 25, password: "password123" },
        ];

        // Usa insertMany
        await UserModel.insertMany(users);
        console.log("Usuarios insertados correctamente");
    } catch (error) {
        console.error("Error al insertar usuarios:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();
