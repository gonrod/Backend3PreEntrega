const express = require('express');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const UserModel = require("../dao/models/User");
const logger = require("../utils/loggerUtils"); 


const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); // Permitir el acceso si hay sesión
    } else {
        res.redirect('/login'); // Redirigir al login si no hay sesión
    }
};

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/perfil'); // Redirigir al perfil si ya estoy logueado
    } else {
        next(); // Permitir el acceso si no hay sesión
    }
};


const authenticateJWT = async (req, res, next) => {
    try {
        const token = req.cookies.tokenCookie;
        if (!token) {
            logger.error("❌ No se encontró un token en las cookies.");
            return res.redirect('/login'); 
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            logger.error(`❌ JWT Authentication error: ${error.message}`);
            return res.status(401).json({ error: "Usuario no encontrado, inicia sesión." }); 
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error("❌ Error en authenticateJWT:", error);
        return res.status(403).json({ error: "Token inválido o expirado." }); // JSON con error específico
    }
};



const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn("⚠️ Unauthorized access: No user session found.");
            return res.status(401).json({ error: "No autenticado" });
        }

        if (!roles.includes(req.user.role)) {
            logger.warn(`⚠️ Access denied for user ${req.user.email} - Role required: ${roles.join(", ")}`);
            return res.status(403).json({ error: "No autorizado" });
        }

        next();
    };
};

module.exports = { authorizeRoles, authenticateJWT };