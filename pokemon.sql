CREATE TABLE ability_pokemon(
    id INTEGER,
    pokemon_id INTEGER,
    ability_id INTEGER,
    FOREIGN KEY (pokemon_id) REFERENCES pokemons (id),
    FOREIGN KEY (ability_id) REFERENCES abilities (id)
);
CREATE TABLE abilities(id INTEGER, name VARCHAR, ability_id INT);
CREATE TABLE pokemons (
    id INTEGER,
    name VARCHAR,
    weight INTEGER,
    pokemon_api_id INT
    base_experience integer
);
CREATE TABLE user_pokemon_favorite(
    id INTEGER,
    user_id INTEGER,
    pokemon_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemons (id)
);
CREATE TABLE users(
    id INTEGER,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR
);