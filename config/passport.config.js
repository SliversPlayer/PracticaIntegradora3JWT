import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import usersModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import { generateAuthToken } from '../services/authService.js'; // Importa la función para generar JWT
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const userService = usersModel;
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    // Estrategia de Registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };
                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al crear el usuario: " + error);
            }
        }
    ));

    // Estrategia de Login
    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username });
            if (!user) {
                console.log("El usuario no existe");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
                console.log("Contraseña no válida");
            }

            // Generar un token JWT después de autenticarse
            const token = generateAuthToken(user);
            return done(null, { user, token });
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de GitHub OAuth
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 89,
                    email: profile._json.email,
                    password: ""
                };
                let result = await userService.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;
