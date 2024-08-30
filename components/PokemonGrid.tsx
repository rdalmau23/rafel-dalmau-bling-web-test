"use client";
import React, { useState, useEffect } from 'react';
import { PokeCard } from './PokeCard';
import { Input } from './ui/input';

interface PokemonGridProps {
    initialPokemonList: any[];
}

export function PokemonGrid({ initialPokemonList }: PokemonGridProps) {
    const [pokemonList, setPokemonList] = useState(initialPokemonList);
    const [searchText, setSearchText] = useState('');
    const [offset, setOffset] = useState(20);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const searchFilter = (pokemonList: any[]) => {
        return pokemonList.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const filteredPokemon = searchFilter(pokemonList);

    // function to load more pokemonsd
    const loadMorePokemon = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
            const data = await response.json();

            if (data.results.length < 20) {
                setHasMore(false);
            }

            setPokemonList((prevList) => [...prevList, ...data.results]);
            setOffset((prevOffset) => prevOffset + 20);
        } catch (error) {
            console.error('Error loading more Pokémon:', error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
                return;
            }
            if (hasMore) {
                loadMorePokemon();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, offset]);

    return (
        <>
            <div>
                <h3 className="text-2xl py-6 text-center">Search</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                        type="text"
                        value={searchText}
                        autoComplete="off"
                        id="pokemonName"
                        placeholder="Enter Pokemon name..."
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <h3 className="text-3xl pt-12 pb-6 text-center">Pokemon List</h3>
            </div>
            <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
                {filteredPokemon.map((pokemon) => (
                    <PokeCard name={pokemon.name} key={pokemon.name + 'card'} />
                ))}
            </div>
            {loading && (
                <div className="text-center">
                    <p>Loading more Pokemon...</p>
                </div>
            )}
        </>
    );
}
