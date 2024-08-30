const POKEMON_API = "https://pokeapi.co/api/v2/";

// Fetch Pokémon list with pagination
export async function getPokemonList(offset: number = 0, limit: number = 20) {
    const response = await fetch(`${POKEMON_API}pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
}

// Fetch details of a single Pokémon by name
export async function getPokemon(name: string) {
    const response = await fetch(`${POKEMON_API}pokemon/${name}`);
    const data = await response.json();
    return data;
}
