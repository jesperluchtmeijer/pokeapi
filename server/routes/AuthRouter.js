import express from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();
const authController = new AuthController();
import passport from 'passport';

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/auth', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    res.send('auth');

});

export default router;