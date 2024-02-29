import fetch from 'node-fetch';
import sqlite3 from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const db = new sqlite3('./pokemon.db');

const getPokemon = async (name) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = await response.json();

    const id = uuidv4();
    db.prepare('INSERT INTO pokemons (name, id, weight) VALUES (?, ?, ?)').run(pokemon.name, id, pokemon.weight);
};

getPokemon('charizard');