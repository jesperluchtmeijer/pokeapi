import express from "express";
import PokemonController from "../controllers/PokemonController.js";

const router = express.Router();
const pokemonController = new PokemonController();

router.get("/fetchAndSavePokemon", pokemonController.fetchAndSavePokemon);
router.get("/show-pokemon", pokemonController.showPokemon);
router.get('/show-pokemon/:id', pokemonController.getPokemonById);
router.get('/show-pokemon-name/:query', pokemonController.getPokemonBySearchQuery);


export default router;