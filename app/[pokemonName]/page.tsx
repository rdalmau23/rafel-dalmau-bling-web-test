import { getPokemon } from "@/lib/pokeAPI";
import { PokemonImage } from "@/components/PokemonImage";
import { Progress } from "@/components/ui/progress";

export default async function PokemonPage({ params }: { params: { pokemonName: string } }) {
  const { pokemonName } = params;

  // get the pokemon api
  const pokemonObject = await getPokemon(pokemonName);
  return (
    <>
      <h1 className="text-4xl font-bold pt-4">{pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h1>
      <div className="pokemon-image-container m-4">
        <PokemonImage
          image={pokemonObject.sprites.other['official-artwork'].front_default}
          name={pokemonName}
          className="pokemon-image-normal"
        />
        <PokemonImage
          image={pokemonObject.sprites.other['official-artwork'].front_shiny}
          name={pokemonName}
          className="pokemon-image-shiny"
        />
      </div>
      <h3>Weight: {pokemonObject.weight}</h3>
      <div className="flex-col">
        {pokemonObject.stats.map((statObject: any) => {
          const statName = statObject.stat.name;
          const statValue = statObject.base_stat;

          return (
            <div className="flex items-stretch" style={{ width: "500px" }} key={statName}>
              <h3 className="p-3 w-2/4">{statName}: {statValue}</h3>
              <Progress className="w-2/4 m-auto" value={statValue} />
            </div>
          );
        })}
      </div>
    </>
  );
}
