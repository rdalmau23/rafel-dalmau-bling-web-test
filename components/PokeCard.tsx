import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PokemonCardProps {
  name: string;
}

export function PokeCard({ name }: PokemonCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonImage = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        setImageUrl(data.sprites.front_default);
      } catch (error) {
        console.error("Error fetching Pokémon image:", error);
      }
    };

    fetchPokemonImage();
  }, [name]);

  return (
    <Link
      href={`/${name}`}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors m-3 dark:border-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      key={name + "Card"}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          width={80} 
          height={80}
          className="mb-3"
        />
      )}
      <h2 className="text-2xl font-semibold">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </h2>
    </Link>
  );
}
