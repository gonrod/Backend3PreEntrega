const User = require('../models/User');
class UserDAO {
    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async getUserByResetToken(token) {
        return await User.findOne({ resetToken: token });
    }    
}

module.exports = new UserDAO();
