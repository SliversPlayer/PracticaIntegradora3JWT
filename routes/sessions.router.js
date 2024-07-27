import { Router } from 'express';
import passport from 'passport';
import {
    registerUser,
    loginUser,
    logoutUser,
    failRegister,
    failLogin,
    githubCallback
} from '../../controllers/user.controller.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), registerUser);
router.get('/failregister', failRegister);

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), loginUser);
router.get('/faillogin', failLogin);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

router.post('/logout', logoutUser);

export default router;