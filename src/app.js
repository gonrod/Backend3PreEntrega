// Cargar Variables de Entorno
require('dotenv').config();

// Importar Módulos Esenciales
const express = require('express');
const cors = require('cors');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const EventEmitter = require('events');
const config = require('./config');
const connectDB = require('./database');

// Configurar Límites de Eventos
EventEmitter.defaultMaxListeners = 20;

// Importar Middlewares
const requestLogger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const { authenticateJWT } = require('./middlewares/auth');

// Importar Rutas
const userRouter = require('./routes/user.router');
const sessionRouter = require('./routes/session.router');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const ticketRouter = require('./routes/ticketsRouter');
const mocksRouter = require('./routes/mocks.router');
const viewsRouter = require("./routes/views.router"); 

// Inicializar Express
const app = express();
const PORT = config.port || 8080;

// Conectar a la Base de Datos
connectDB();

// Configurar Middlewares
app.use(requestLogger);  // 🔹 Middleware de logging
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Configurar Passport
const { initializePassport } = require('./config/passport.config');
initializePassport();
app.use(passport.initialize());

// Configurar Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: { eq: (a, b) => a === b },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Definir Rutas de API
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/mocks', mocksRouter);

// Definir Rutas de Vistas
app.use("/", viewsRouter);

// Redirección Automática en `/`
app.get("/", authenticateJWT, (req, res) => {
    if (!req.user) return res.redirect("/login");
    return req.user.role === "admin" ? res.redirect("/admin-catalog") : res.redirect("/catalog");
});

// Manejo de Errores Global
app.use(errorHandler);

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);
require('./socket')(io); // 🔹 Configuración separada de Socket.IO

// Iniciar Servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
