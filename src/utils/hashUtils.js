const bcrypt = require('bcrypt');

// Generar un hash para una contraseña (asíncrono)
const createHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Verificar si la contraseña es válida (asíncrono)
const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Actualizar contraseñas para usuarios en la base de datos (opcional)
const updatePasswords = async (UserModel) => {
    try {
        const users = await UserModel.find();

        for (const user of users) {
            if (!/^\$2[aby]\$/.test(user.password)) {
                user.password = await createHash(user.password);
                await user.save();
                console.log(`Contraseña actualizada para el usuario: ${user.email}`);
            }
        }
    } catch (error) {
        console.error('Error al actualizar contraseñas:', error);
    }
};

module.exports = {
    createHash,
    isValidPassword,
    updatePasswords,
};
