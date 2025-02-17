require('dotenv').config();

const config = require('./config');
const express = require('express');
const cors = require('cors');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./database');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { authenticateJWT } = require('./middlewares/auth');
const logger = require("./utils/logger"); // O la ruta correcta


const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20;

// Importar Rutas
const userRouter = require('./routes/user.router');
const sessionRouter = require('./routes/session.router');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const ticketRouter = require('./routes/ticketsRouter');
const mocksRouter = require('./routes/mocks.router');

// Inicializar Express
const app = express();
const PORT = config.port || 8080;

app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

app.use('/api/mocks', mocksRouter);

// Configurar Base de Datos
connectDB();

// Configurar Middlewares
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
        allowProtoPropertiesByDefault: true,  // ✅ Permite acceder a propiedades en prototipos
        allowProtoMethodsByDefault: true      // ✅ Permite acceder a métodos en prototipos (si es necesario)
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Definir Rutas
app.use('/api/carts', cartsRouter);
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);

app.use('/api/tickets', ticketRouter);


// Redirección Automática en `/`
app.get("/", authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.redirect("/login"); // No autenticado → Redirigir a login
    }
    if (req.user.role === "admin") {
        return res.redirect("/admin-catalog"); // Admin → Redirigir a realtimeproducts
    }
    return res.redirect("/catalog"); // Usuario normal → Redirigir a catalog
});

// Rutas de Vistas

const viewsRouter = require("./routes/views.router"); 
app.use("/", viewsRouter);

// app.get('/catalog', (req, res) => res.render('catalog'));
// app.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));
// app.get('/login', (req, res) => res.render('login')); // Nueva ruta para /login
// // Ruta para renderizar la vista de registro
// app.get('/register', (req, res) => res.render('register'));

// // Vista para recuperación de contraseña
// app.get("/forgot-password", (req, res) => res.render("forgotPassword"));

// // Vista para restablecimiento de contraseña con token
// app.get("/reset-password/:token", (req, res) => {
//     res.render("resetPassword", { token: req.params.token });
// });

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);
require('./socket')(io); // Configuración separada de Socket.IO

// Iniciar Servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
