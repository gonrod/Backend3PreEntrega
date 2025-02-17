const jwt = require('jsonwebtoken');
const UserRepository = require('../dao/repositories/UserRepository'); // ✅ Ahora todo usa UserRepository
const UserDTO = require('../dtos/UserDTO'); // ✅ Importar correctamente
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Cart = require('../dao/models/Cart'); // Importar el modelo de carrito
const passport = require('passport');
const bcrypt = require('bcrypt'); 

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await UserRepository.getUserByResetToken(token);

        if (!user || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ error: "El token no es válido o ha expirado." });
        }

        // Verificar que la nueva contraseña no sea igual a la anterior
        const passwordMatches = await bcrypt.compare(newPassword, user.password);
        if (passwordMatches) {
            return res.status(400).json({ error: "No puedes usar la misma contraseña anterior." });
        }

        // Hashear la nueva contraseña y guardarla
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserRepository.updateUser(user._id, { 
            password: hashedPassword, 
            resetToken: undefined, 
            resetTokenExpiration: undefined 
        });

        res.json({ message: "Contraseña restablecida correctamente." });
    } catch (error) {
        console.error("❌ Error al restablecer la contraseña:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserRepository.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "No se encontró un usuario con ese correo." });
        }

        // Generar un token seguro y su fecha de expiración (1 hora)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expirationTime = Date.now() + 3600000; // 1 hora en milisegundos

        await UserRepository.updateUser(user._id, { resetToken, resetTokenExpiration: expirationTime });

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Recuperación de contraseña",
            html: `<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                   <p>Haz clic en el siguiente enlace para continuar:</p>
                   <a href="${resetLink}" target="_blank">${resetLink}</a>
                   <p>Este enlace expirará en 1 hora.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Se ha enviado un correo con instrucciones para restablecer la contraseña." });
    } catch (error) {
        console.error("❌ Error en la solicitud de restablecimiento:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// const postLogin = (req, res, next) => {
//     passport.authenticate('login', { session: false }, async (err, user, info) => {
//         if (err) return next(err);
//         if (!user) return res.status(401).send({ message: info.message });

//         try {
//             // Verificar si el usuario es de tipo "user" y no tiene un carrito asignado
//             if (user.role === "user" && !user.cart) {
//                 console.log(`🛒 Usuario ${user.email} no tiene un carrito. Creando uno...`);
//                 const newCart = new Cart({ user: user._id, products: [] });
//                 await newCart.save();

//                 // Asignar el carrito al usuario y guardar el usuario actualizado
//                 await UserRepository.updateUser(user._id, { cart: newCart._id });
//             }

//             // Generar el token JWT
//             const token = jwt.sign(
//                 { id: user._id, email: user.email, role: user.role, cart: user.cart },
//                 process.env.JWT_SECRET,
//                 { expiresIn: process.env.JWT_EXPIRATION || "24h" }
//             );

//             console.log("✅ cartId asignado al usuario:", user.cart); // 🔍 Depuración

//             res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
            
//             // ✅ Definir la URL de redirección según el rol
//             const redirectUrl = user.role === "admin" ? "/realtimeproducts" : "/catalog";
            
//             res.status(200).json({ message: "Login exitoso", token, cartId: user.cart, redirectUrl });

//         } catch (error) {
//             console.error("❌ Error al asignar carrito al usuario:", error);
//             res.status(500).json({ error: "Error interno del servidor" });
//         }
//     })(req, res, next);
// };

const postLogin = (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ message: info.message });

        try {
            if (user.role === "user" && !user.cart) {
                console.log(`🛒 Usuario ${user.email} no tiene un carrito. Creando uno...`);
                const newCart = new Cart({ user: user._id, products: [] });
                console.log("✅ cartId asignado al usuario:", user.cart);
                await newCart.save();
                await UserRepository.updateUser(user._id, { cart: newCart._id });
            }

            const userDTO = new UserDTO(user);
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, cart: user.cart },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || "24h" }
            );

            console.log (user.role);
            res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
            const redirectUrl = user.role === "admin" ? "/admin-catalog" : "/catalog";
            console.log (redirectUrl);
            res.status(200).json({ message: "Login exitoso", token, user: userDTO, redirectUrl });

        } catch (error) {
            console.error("❌ Error al asignar carrito al usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    })(req, res, next);
};

const getCurrentSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autenticado" }); // ✅ Enviar JSON en lugar de redirigir
        }

        res.status(200).json({
            user: {
                first_name: req.user.first_name,
                email: req.user.email,
                role: req.user.role,
                isAdmin: req.user.role === "admin"
            }
        });
    } catch (error) {
        console.error("Error obteniendo la sesión:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};

// const getCurrentSession = async (req, res) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ error: "No autenticado" }); // ✅ Enviar JSON en lugar de redirigir
//         }

//         res.status(200).json({
//             user: {
//                 first_name: req.user.first_name,
//                 email: req.user.email,
//                 role: req.user.role,
//                 isAdmin: req.user.role === "admin"
//             }
//         });
//     } catch (error) {
//         console.error("Error obteniendo la sesión:", error);
//         res.status(500).json({ error: "Error del servidor" });
//     }
// };

const registerUser = async (req, res) => {
    try {
        console.log("📌 Datos recibidos en el servidor:", req.body);

        const { first_name, last_name, email, password, role, age } = req.body;

        if (!first_name || !last_name || !email || !password || !role || !age) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // ✅ Convertir la fecha de nacimiento en edad
        const birthDate = new Date(age);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();

        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role,
            age: calculatedAge,
        });

        return res.status(201).json({ message: "Usuario registrado exitosamente", redirectUrl: "/login" });

    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = {
    getCurrentSession,
    postLogin,
    registerUser,
    resetPassword,
    requestPasswordReset
};
