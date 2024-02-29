import express from "express";
import {fetchAndSavePokemon, getPokemon, showPokemon} from "../controllers/pokemonController.js";

const router = express.Router();

router.get("/fetchAndSavePokemon", async (req, res) => {
    try {
        await fetchAndSavePokemon();
        res.send("Pokemon fetched and saved!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get("/show-pokemon", async (req, res) => {
    try {
        const pokemons = await showPokemon();
        res.status(200).json({message:"JOOOO",pokemons});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/show-pokemon/:id', async (req, res) => {
    try {
        const pokemonId = req.params.id;
        const pokemon = await getPokemon(pokemonId);
        if (!pokemon) {
            return res.status(404).json({ error: `Pokemon with ID ${pokemonId} not found` });
        }
        res.json(pokemon);
    } catch (error) {
        console.error(`Error occurred while handling request for Pokemon with ID ${pokemonId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;