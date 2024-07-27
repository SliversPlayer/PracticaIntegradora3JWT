import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import usersModel from '../models/user.model.js'
import { createHash, isValidPassword } from "../utils.js";
import dotenv from 'dotenv';

// Cargar variables de entorno test
dotenv.config();
const userService = usersModel;
const LocalStrategy = local.Strategy
const initializePassport=()=>{
    //Estrategias/Middlewares
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req,username, password, done) => {
            const { first_name, last_name,  email, age } = req.body
            try {
                let user = await userService.findOne({email:username})
                if(user){
                    console.log("El usuario ya existe")
                    return done(null, false)
                }
                const newUser={
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }
                let result = await userService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el suuario" + error)
            }
        }
    ))
    passport.use('github', new GitHubStrategy({

        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        
    }, async(accessToken, refreshToken, profile, done)=>{
        try {
            console.log(profile);
            let user = await userService.findOne({email: profile._json.email})
            if(!user){
                let newUser={
                    first_name:profile._json.name,
                    last_name:"",
                    age: 89,
                    email:profile._json.email,
                    password:""
                }
                let result = await userService.create(newUser)
                done(null,user)
            }
            else{
                done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }
))
    //Serializar y deserializar
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let user = await userService.findById(id)
        done(null,user)
    })
    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done)=>{
        try {
            const user = await userService.findOne({email:username})
            if(!user){
                console.log("El usuario no existe");
                return done(null,user)
            }
            if(!isValidPassword(user,password))return done(null,false)
                return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}
export default initializePassport