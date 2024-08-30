import { PokemonGrid } from '@/components/PokemonGrid';
import { getPokemonList } from '@/lib/pokeAPI';

export default async function Home() {
    const initialData = await getPokemonList(); // Initial fetch of the first 20 Pokémon

    return (
        <PokemonGrid initialPokemonList={initialData.results} />
    );
}
