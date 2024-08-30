// api.ts
const POKEMON_API = "https://pokeapi.co/api/v2/";

// Fetch pokemon list pagination
export async function getPokemonList(offset: number = 0, limit: number = 20) {
    const response = await fetch(`${POKEMON_API}pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
        throw new Error('Error fetching Pokémon list');
    }
    const data = await response.json();
    return data;
}

// only pokemon
export async function getPokemon(name: string) {
    const response = await fetch(`${POKEMON_API}pokemon/${name}`);
    if (!response.ok) {
        throw new Error(`Error fetching Pokémon details for ${name}`);
    }
    const data = await response.json();
    return data;
}

// Fetch types
export async function getPokemonTypes() {
    const response = await fetch(`${POKEMON_API}type`);
    if (!response.ok) {
        throw new Error('Error fetching Pokémon types');
    }
    const data = await response.json();
    return data.results;
}
