const passport = require('passport');
const local = require( 'passport-local');
const UserModel = require( '../dao/models/User.js');
const { createHash, isValidPassword } = require( '../utils/passwordUtils.js');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const LocalStrategy = local.Strategy;

function initializePassport() {
    //Nota que passport utiliza sus propios "middlewares" de acuerdo a cada estrategia
    //Inicializamos la estrategia local
    /*
    * username será en este caso el correo.
    * done será el callback de resolución de passport, el primer argumento es para error y el segundo para el usuario.
    */
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, //passReqToCallback permite que se pueda acceder al objeto req como cualquier otro middleware.
        async (req, emailArg, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await UserModel.findOne({ email: email });
                if (user) {
                    //NO encontrar un usuario no significa que sea un error, asi que el error lo pasamos como null, pero al usuario como false
                    //esto significa "No ocurrio un error al buscar el usuario, pero el usuario ya existe y no puedo dejarte continuar" 
                    console.log('User already exists');
                    return done(null, false);
                }
                let newUser = {
                    first_name, 
                    last_name,
                    email, 
                    age,
                    password: createHash(password)
                };
        
                const userCreated = await userService.create(newUser);
                return done(null, userCreated); //Registración exitosa, retorno el usuario en el callback done
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser( async(id, done) => {
        let user = await UserModel.findById(id);
        done(null, user.id);
    }); 
    passport.use('login',new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email' }, 
        async (req, email, password, done) => {
            try {
                const user = await UserModel.findOne({ email: email });
                console.log(user);
                if(!user){
                    console.log('User doesnt exist');
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                if(!isValidPassword(password, process.env.JWT_SECRET)) return done(null, false, { message: 'Contraseña incorrecta' });
                return done(null, user); //Autenticación exitosa, retorno el usuario en el callback done
            } catch (error) {
                return done(error);
            }
        }
    ))

};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.tokenCookie; // Extract token from the cookie
    }
    return token;
};

const opts = {
    jwtFromRequest: cookieExtractor, // Extract token from cookie
    secretOrKey: process.env.JWT_SECRET, // Secret key to verify JWT
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await UserModel.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = {
 initializePassport,   
};