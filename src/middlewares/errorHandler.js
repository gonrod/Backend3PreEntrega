const errorDictionary = {
    "USER_ALREADY_EXISTS": { status: 400, message: "El usuario ya existe" },
    "INVALID_USER_DATA": { status: 400, message: "Datos de usuario inválidos" },
    "PET_ALREADY_EXISTS": { status: 400, message: "La mascota ya existe" },
    "INVALID_PET_DATA": { status: 400, message: "Datos de mascota inválidos" },
    "SERVER_ERROR": { status: 500, message: "Error interno del servidor" }
};

const errorHandler = (err, req, res, next) => {
    const error = errorDictionary[err.message] || errorDictionary["SERVER_ERROR"];
    res.status(error.status).json({ error: error.message });
};

export default errorHandler;
