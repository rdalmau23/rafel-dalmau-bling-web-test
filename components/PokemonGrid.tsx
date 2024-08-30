"use client";
import React, { useState, useEffect } from 'react';
import { PokeCard } from './PokeCard';
import { Input } from './ui/input';
import { Select } from './ui/select'; 
import { getPokemonList, getPokemon, getPokemonTypes } from '../lib/pokeAPI';

interface Pokemon {
    name: string;
    url: string;
}

interface PokemonType {
    name: string;
    url: string;
}

interface PokemonGridProps {
    initialPokemonList: Pokemon[];
}

export function PokemonGrid({ initialPokemonList }: PokemonGridProps) {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialPokemonList);
    const [searchText, setSearchText] = useState('');
    const [offset, setOffset] = useState(20);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('');
    const [types, setTypes] = useState<PokemonType[]>([]); 
    const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const typesData = await getPokemonTypes();
                setTypes(typesData);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        const filterPokemon = async () => {
            try {
                const results = await Promise.all(
                    pokemonList.map(async (pokemon) => {
                        const pokemonData = await getPokemon(pokemon.name);
                        const typeNames = pokemonData.types.map((typeInfo: any) => typeInfo.type.name);
    
                        // check if is the selected and searched
                        const matchesType = typeNames.includes(selectedType) || !selectedType;
                        const matchesSearchText = pokemon.name.toLowerCase().includes(searchText.toLowerCase());
    
                        if (matchesType && matchesSearchText) {
                            return pokemon;
                        }
                        return null;
                    })
                );
                setFilteredPokemon(results.filter((p) => p !== null));
            } catch (error) {
                console.error('Error filtering Pokémon:', error);
            }
        };
    
        filterPokemon();
    }, [searchText, selectedType, pokemonList]);
    

    // load more pokemon function
    const loadMorePokemon = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const data = await getPokemonList(offset);
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


    const selectOptions = [{ value: '', label: 'Select a type...' }, ...types.map((type) => ({
        value: type.name,
        label: type.name.charAt(0).toUpperCase() + type.name.slice(1)
    }))];

    return (
        <>
            <div>
                <h3 className="text-2xl py-6 text-center mt-8">Search</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                        type="text"
                        value={searchText}
                        autoComplete="off"
                        id="pokemonName"
                        placeholder="Enter Pokémon name..."
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        options={selectOptions}
                        className="mt-4"
                    />
                </div>
                <h3 className="text-3xl pt-12 pb-6 text-center">Pokémon List</h3>
            </div>
            <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left md:grid-cols-3 sm:grid-cols-2">
                {filteredPokemon.map((pokemon) => (
                    <PokeCard name={pokemon.name} key={pokemon.name + 'card'} />
                ))}
            </div>
            {loading && (
                <div className="text-center">
                    <p>Loading more Pokémon...</p>
                </div>
            )}
        </>
    );
}
