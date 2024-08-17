import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import usersModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import { comparePassword } from '../services/authService.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const userService = usersModel;
const LocalStrategy = local.Strategy;

const initializePassport = () => {

    // Estrategia de Login
    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await usersModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado (Passport)' });
            }
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

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
                return done(error);
            }
        }
    ));

    // Estrategia JWT
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            let user = await userService.findById(jwt_payload._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

export default initializePassport;