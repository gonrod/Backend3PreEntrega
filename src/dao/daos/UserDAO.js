const User = require('../models/User');

class UserDAO {
    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error("Error obteniendo usuario por email:", error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            console.error("Error creando usuario:", error);
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true });
        } catch (error) {
            console.error("❌ Error actualizando usuario:", error);
            throw error;
        }
    }

    async getUserByResetToken(token) {
        return await User.findOne({ resetToken: token });
    }    
}

module.exports = new UserDAO();
