"use client";
import Image from "next/image";

interface PokemonImageProps {
  image: string;
  name: string;
  className?: string;
}

export function PokemonImage({ image, name, className }: PokemonImageProps) {
  return (
    <div className={`relative ${className}`} style={{ width: "300px", height: "300px" }}>
      <Image
        src={image}
        alt={`Photo of ${name}`}
        priority
        fill
        style={{ objectFit: "contain" }}
        className="absolute inset-0 transition-opacity duration-500"
      />
    </div>
  );
}
