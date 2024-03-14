import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import Database from "better-sqlite3";
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('pokemon.db');

class FavoriteController {
    async add(req, res) {
        try {
            const pokemonId = req.params.id;
            const userId = req.user.id;

            const addToFavorites = db.prepare("INSERT INTO user_pokemon_favorite (id, user_id, pokemon_id) VALUES (?, ?, ?)");
            addToFavorites.run(
                uuidv4(),
                userId,
                pokemonId
            );
            res.json({message: 'Pokemon added to favorites successfully'});
        } catch (error) {
            console.error('Error occurred while adding pokemon to favorites:', error);
            res.status(500).json({message: 'An error occurred while adding pokemon to favorites'});

        }
    }
    async index(req, res) {
        try {
            const userId = req.user.id;
            const getFavorites = db.prepare("SELECT * FROM user_pokemon_favorite WHERE user_id = ?");
            const favorites = getFavorites.all(userId);
            res.json(favorites);
        } catch (error) {
            console.error('Error occurred while getting favorites:', error);
            res.status(500).json({message: 'An error occurred while getting favorites'});
        }
    }
    async remove(req, res) {
        try {
            const pokemonId = req.params.id;
            const userId = req.user.id;

            const removeFromFavorites = db.prepare("DELETE FROM user_pokemon_favorite WHERE user_id = ? AND id = ?");
            removeFromFavorites.run(userId, pokemonId);
            res.json({message: 'Pokemon removed from favorites successfully'});
        } catch (error) {
            console.error('Error occurred while removing pokemon from favorites:', error);
            res.status(500).json({message: 'An error occurred while removing pokemon from favorites'});
        }
    }
}

export default FavoriteController;