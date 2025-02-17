const { Router } = require('express');
const UserModel = require('../dao/models/User');
const { createHash } = require('../utils/hashUtils');

const router = Router();


router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password'); // Excluir la contraseña de los resultados
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para registrar usuarios desde un formulario (render de vista)
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para registrar un usuario (API)
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'La contraseña es requerida' });
        }

        const hashedPassword = await createHash(password);

        // Validar el rol antes de asignarlo
        const validRoles = ['user', 'admin'];
        const assignedRole = validRoles.includes(role) ? role : 'user'; // Si el rol no es válido, se asigna "user" por defecto

        // Crear usuario en la base de datos
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role: assignedRole
        });

        await newUser.save();

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});
// Ruta para el usuario actual (ejemplo)
router.get('/current', (req, res) => {
    res.status(200).send({ message: 'Ruta /current implementada' });
});

module.exports = router;
