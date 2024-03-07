import express from "express";
import FavoriteController from "../controllers/FavoriteController.js";
import passport from 'passport';

const router = express.Router();
const favoriteController = new FavoriteController();

router.post('/add/:id', passport.authenticate('jwt', {session: false}), favoriteController.add);
router.get('/index', passport.authenticate('jwt', {session: false}), favoriteController.index);
router.post('/remove/:id', passport.authenticate('jwt', {session: false}), favoriteController.remove);

export default router;