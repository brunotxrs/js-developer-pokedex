import { Pokemon } from './pokemon_model.js'

// A função convertPokeApiDetailToPokemon é auxiliar e pode ficar fora do pokeApi, como você já a tem.
function convertPokeApiDetailToPokemon(pokemonDetailApi){
    const pokemon = new Pokemon()

    pokemon.number = pokemonDetailApi.id;
    pokemon.name = pokemonDetailApi.name;

    pokemon.types = pokemonDetailApi.types.map(typeSlot => typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokemonDetailApi.sprites.other.dream_world.front_default || pokemonDetailApi.sprites.front_default;


    // *** ADICIONANDO NOVOS CAMPOS PARA DETALHES COMPLETOS ***
    pokemon.height = pokemonDetailApi.height; // Em decimetros
    pokemon.weight = pokemonDetailApi.weight; // Em hectogramas
    
    // Verificação defensiva para habilidades:
    if (pokemonDetailApi.abilities && Array.isArray(pokemonDetailApi.abilities)) {
        pokemon.abilities = pokemonDetailApi.abilities.map(abilitySlot => abilitySlot.ability); 
    } else {
        pokemon.abilities = []; // Garante que seja um array vazio se os dados estiverem faltando
    }

    pokemon.stats = pokemonDetailApi.stats; // Array de objetos {base_stat: X, stat: {name: "..."}}

    return pokemon
}

const pokeApi = {};

// chamando api e manipulando (lista paginada de Pokémons)
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
        // É importante relançar o erro (throw error) para que o chamador (actions.js) possa tratá-lo adequadamente.
        console.error('Erro na chamada da PokeAPI (getPokemons):', error);
        throw error; 
    }
}

// manipulando os detalhes de UM pokemon
pokeApi.getPokemonsDetail = async (pokemon) => { // Mantido o nome 'getPokemonsDetail' para consistência com o seu código
    try {
        const response = await fetch(pokemon.url);
        const pokemonsDetails = await response.json();
        return convertPokeApiDetailToPokemon(pokemonsDetails);
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        throw error;
    }
}

// Busca um Pokémon específico por nome ou ID exato.
pokeApi.getPokemonByNameOrId = async (idOrName) => {
    const formattedIdOrName = String(idOrName).toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${formattedIdOrName}/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Pokémon "${idOrName}" não encontrado.`);
        }
        const pokeDetail = await response.json();
        return convertPokeApiDetailToPokemon(pokeDetail);
    } catch (error) {
        console.error('Erro ao buscar Pokémon por nome/ID exato:', error);
        throw error;
    }
};

//  Para buscar a descrição do Pokémon (da API de Species)
pokeApi.getPokemonDescription = async (idOrName) => {
    const formattedIdOrName = String(idOrName).toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon-species/${formattedIdOrName}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Descrição do Pokémon "${idOrName}" não encontrada.`);
        }
        const speciesData = await response.json();

        // A descrição está em 'flavor_text_entries'. Precisamos encontrar uma em português (ou inglês como fallback).
        const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en'); 
        
        return descriptionEntry ? descriptionEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'Descrição não disponível.'; // Limpa quebras de linha
    } catch (error) {
        console.error('Erro ao buscar descrição do Pokémon:', error);
        throw error; // Re-lança o erro para que showPokemonDetails possa tratá-lo
    }
};



// *** ESTA É A FUNÇÃO QUE ESTAVA FALTANDO NO SEU api_pokemon.js! ***
pokeApi.getAllPokemonBasicData = async () => {
    // Usei um limite alto para buscar a lista básica de todos os Pokémons (apenas nome e URL).
    // Isso é útil para buscas futuras como "começa com".
    const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=10000`; 

    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        return jsonBody.results; // Retorna um array de objetos {name: "nome", url: "url"}
    } catch (error) {
        console.error('Erro ao buscar lista básica de todos os Pokémons:', error);
        throw error;
    }
};

export { pokeApi }