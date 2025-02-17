const bcrypt = require('bcrypt');

// Hashear la contraseña (versión asíncrona)
const createHash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Verificar si la contraseña es válida (versión asíncrona)
const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Actualizar contraseñas para usuarios en la base de datos
const updatePasswords = async (UserModel) => {
    try {
        // Encuentra todos los usuarios en la base de datos
        const users = await UserModel.find();

        for (const user of users) {
            // Verifica si la contraseña ya está hasheada
            const isHashed = /^\$2[aby]\$/.test(user.password);
            if (!isHashed) {
                // Hashear la contraseña y actualizarla en la base de datos
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
                await user.save();

                console.log(`Contraseña actualizada para el usuario con email: ${user.email}`);
            } else {
                console.log(`La contraseña ya está hasheada para el usuario con email: ${user.email}`);
            }
        }

        console.log('Todas las contraseñas han sido procesadas.');
    } catch (error) {
        console.error('Error al actualizar contraseñas:', error);
    }
};

module.exports = {
    createHash,
    isValidPassword,
    updatePasswords,
};
