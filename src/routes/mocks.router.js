import { Router } from 'express';
import { generateMockUser, generateMockPet } from '../utils/mocking.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

// Generar 100 mascotas ficticias
router.get('/mockingpets', (req, res) => {
    const pets = Array.from({ length: 100 }, generateMockPet);
    res.json(pets);
});

// Generar 50 usuarios ficticios
router.get('/mockingusers', (req, res) => {
    const users = Array.from({ length: 50 }, generateMockUser);
    res.json(users);
});

// Generar e insertar usuarios y mascotas en la base de datos
router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body;

    if (!users || !pets || users < 1 || pets < 1) {
        return res.status(400).json({ message: "Parámetros inválidos" });
    }

    try {
        const mockUsers = Array.from({ length: users }, generateMockUser);
        const insertedUsers = await userModel.insertMany(mockUsers);

        const mockPets = Array.from({ length: pets }, generateMockPet);
        await petModel.insertMany(mockPets);

        res.json({ message: "Datos generados correctamente", users: insertedUsers.length, pets: mockPets.length });
    } catch (error) {
        res.status(500).json({ message: "Error al insertar datos", error });
    }
});

export default router;
