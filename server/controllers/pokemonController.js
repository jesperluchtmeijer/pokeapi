import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import {fileURLToPath} from 'url';
import Database from "better-sqlite3";
import path from 'path';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('pokemon.db');

async function fetchAndSavePokemon() {
    try {
        for (let i = 1; i <= 307; i++)
        {
            const abilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${i}`)

            if (!abilityResponse.ok) {
                console.log(`ability${i} doesn't exist in the API`);
            } else {
                const abilityData = await abilityResponse.json();
                await saveAbilities(abilityData);
            }

        }



        for (let i = 1; i <= 50; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);

            if (!response.ok) {
                console.log(`pokemon${i} doesn't exist in the API`);
            } else {
                const pokemonData = await response.json();
                await savePokemon(pokemonData);
            }
        }
    } catch (error) {
        console.error('Error occurred while fetching Pokemon data:', error);
    }
}
async function saveAbilities(abilityData){
    try{
    const id = uuidv4();
    const ability = db.prepare("INSERT INTO abilities (id, name, ability_id) VALUES (?, ?, ?)");
    ability.run(
        id,
        abilityData.name,
        abilityData.id,
    );
        console.log(`Ability ${abilityData.name} saved to database.`);
    } catch (error) {
        console.error('Error occurred while saving Ability:', error);
    }


}



async function savePokemon(pokemonData) {
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
        // for (const ability of pokemonData.abilities) {
        //     if (!ability.is_hidden) {
        //         const abilityResponse = await fetch(ability.ability.url);
        //         if (!abilityResponse.ok) {
        //             console.log(`Unable to fetch ability data for ${ability.ability.name}`);
        //             continue;
        //         }
        //         const abilityData = await abilityResponse.json();
        //         await savePokemonAbility(pokemonData, abilityData);
        //     }
        // }

    } catch (error) {
        console.error('Error occurred while saving Pokemon:', error);
    }
}

async function showPokemon() {
    try {
        const pokemons = db.prepare("SELECT * FROM pokemons").all();
        console.log(pokemons)
        return pokemons;
    } catch (error) {
        console.error('Error occurred while fetching Pokemon from database:', error);
        throw error;
    }
}

async function getPokemon(pokemonId) {
    try {
        const pokemon = await db.prepare("SELECT * FROM pokemons WHERE id = ?").get(pokemonId);
        return pokemon;
    } catch (error) {
        console.error(`Error occurred while fetching Pokemon with ID ${pokemonId} from database:`, error);
        throw error;
    }
}

// async function savePokemonAbility(pokemonData, abilityData) {
//     try {
//         const pokemonId = await db.prepare("SELECT pokemon_api_id FROM pokemons WHERE pokemon_api_id = ?").pluck().get(pokemonData.id);
//         if (!pokemonId) {
//             console.error(`Pokemon with API ID ${pokemonData.id} not found in the database.`);
//             return;
//         }
//
//         const abilityId = await db.prepare("SELECT ability_id FROM abilities WHERE ability_id = ?").pluck().get(abilityData.id);
//         if (!abilityId) {
//             console.error(`Ability with ID ${abilityData.id} not found in the database.`);
//             return;
//         }
//
//         const ability_pokemon = db.prepare("INSERT INTO ability_pokemon (pokemon_id, ability_id) VALUES (?, ?)");
//         ability_pokemon.run(pokemonId, abilityId);
//         console.log(`Saved Ability-Pokemon relationship: Pokemon ID ${pokemonId} - Ability ID ${abilityId}`);
//
//     } catch (error) {
//         console.error('Error occurred while saving Pokemon ability:', error);
//     }
// }

export { fetchAndSavePokemon, showPokemon, getPokemon };