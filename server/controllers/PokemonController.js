import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import Database from "better-sqlite3";
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('pokemon.db');

class PokemonController {
    fetchAndSavePokemon = async (req, res) => {
        try {
            for (let i = 1; i <= 307; i++) {
                const abilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${i}`)
                if (abilityResponse.ok) {
                    const abilityData = await abilityResponse.json();
                    await this.saveAbilities(abilityData);
                } else {
                    console.log(`ability${i} doesn't exist in the API`);
                }
            }

            for (let i = 1; i <= 50; i++) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);

                if (response.ok) {
                    const pokemonData = await response.json();
                    await this.savePokemon(pokemonData);
                } else {
                    console.log(`pokemon${i} doesn't exist in the API`);
                }
            }
            res.send("Pokemon fetched and saved!");
        } catch (error) {
            console.error('Error occurred while fetching Pokemon data:', error);
        }
    }

    saveAbilities = async (abilityData) => {
        try {
            const id = uuidv4();
            const ability = db.prepare("INSERT INTO abilities (id, name, ability_id) VALUES (?, ?, ?)");
            ability.run(
                id,
                abilityData.name,
                abilityData.id,
            );
        } catch (error) {
            console.error('Error occurred while saving Ability:', error);
        }
    }

    savePokemon = async (pokemonData) => {
        try {
            const id = uuidv4();
            const pokemon = db.prepare("INSERT INTO pokemons (id, name, weight, base_experience, pokemon_api_id) VALUES (?, ?, ?, ?, ?)");
            pokemon.run(
                id,
                pokemonData.name,
                pokemonData.weight,
                pokemonData.base_experience,
                pokemonData.id,
            );
            console.log(`Pokemon ${pokemonData.name} saved to database.`);

        } catch (error) {
            console.error('Error occurred while saving Pokemon:', error);
        }
    }

    async showPokemon(req, res) {
        try {
            const pokemons = db.prepare("SELECT * FROM pokemons").all();
            console.log(pokemons);
            res.status(200).json(pokemons);
        } catch (error) {
            console.error('Error occurred while fetching Pokemon from database:', error);
            throw error;
        }
    }

    async getPokemonById(req, res) {
        try {
            const pokemonId = req.params.id;
            const pokemon = await db.prepare("SELECT * FROM pokemons WHERE id = ?").get(pokemonId);
            if (!pokemon) {
                return res.status(404).json({error: `Pokemon with ID ${pokemonId} not found`});
            }
            res.json(pokemon);
        } catch (error) {
            console.error(`Error occurred while fetching Pokemon with ID ${pokemonId} from database:`, error);
            throw error;
        }
    }

    async getPokemonBySearchQuery(req, res) {
        try {
            const pokemonName = req.params.query;
            const pokemons = await db.prepare(`SELECT * FROM pokemons WHERE name LIKE '%' || ? || '%'`).all(pokemonName);
            if (pokemons.length === 0) {
                return res.status(404).json({error: `There was no pokemon found`});
            }
            res.json(pokemons);
        } catch (error) {
            console.error(`Error occurred while fetching Pokemon with name ${pokemonName} from database:`, error);
            throw error;
        }
    }



}

export default PokemonController;