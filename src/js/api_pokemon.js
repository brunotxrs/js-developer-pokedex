import { Pokemon } from './pokemon_model.js'

const pokeApi = {};

// chamando api e manipulando
pokeApi.getPokemons = async (offset = 0 , limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        const pokemons = jsonBody.results;
        const detailPromises = pokemons.map(pokeApi.getPokemonsDetail);
        const pokemonDetailsArray = await Promise.all(detailPromises);
        return pokemonDetailsArray;
    } catch (error) {
        return console.error('Erro na chamada da PokeAPI:', error);
    }

}

// manipulando os detalhes dos pokemons
pokeApi.getPokemonsDetail = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        const pokemonsDetails = await response.json();
        return convertPokeApiDetailToPokemon(pokemonsDetails);
    } catch (error) {
        return console.error('Erro ao buscar detalhes do Pokémon:', error);
    }
}


// criando os pokemons
function convertPokeApiDetailToPokemon(pokemonDetailApi){
    const pokemon = new Pokemon()

    pokemon.number = pokemonDetailApi.id;
    pokemon.name = pokemonDetailApi.name;

    pokemon.types = pokemonDetailApi.types.map(typeSlot => typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokemonDetailApi.sprites.other.dream_world.front_default || pokemonDetailApi.sprites.front_default;


    return pokemon
}

export { pokeApi }