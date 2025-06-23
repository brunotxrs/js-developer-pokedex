import { searchType } from './search_type.js';
import { setupCardDetailsEvents } from './card_details.js';
import { Pokemon } from './pokemon_model.js'

function PokemonToLi() {
    return `
        <li class="pokemon-list">
            <span>#999</span>
            <img src="./src/assets/img/Silhouette.png" alt="">
            <span>Pokémon Name</span>
        </li>
    `
}

let showPokemon = 2;
const ol = document.getElementById("ol");
let generateHtml = '';

for (let i = 0; i < showPokemon; i++) {

   generateHtml += PokemonToLi()
    
}

ol.innerHTML = generateHtml



const pokeApi = {};

function convertPokeApiDetailToPokemon(pokemonDetailApi){
    const pokemon = new Pokemon()

    pokemon.number = pokemonDetailApi.id;
    pokemon.name = pokemonDetailApi.name;

    pokemon.types = pokemonDetailApi.types.map(typeSlot => typeSlot.type.name);
    pokemon.type = pokemon.types[0];
    pokemon.photo = pokemonDetailApi.sprites.other.dream_world.front_default || pokemonDetailApi.sprites.front_default;


    return pokemon
}

// manipulando os dados dos pokemons
pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then((pokemonsDetails) => convertPokeApiDetailToPokemon(pokemonsDetails))
    .catch((error) => console.error('Erro ao buscar detalhes do Pokémon:', error));
}


// chamada da api
pokeApi.getPokemons = (offset = 0 , limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
    .then((detailPromises) => Promise.all(detailPromises))
    .then((pokemonDetailsArray) => pokemonDetailsArray)
    .catch((error) => console.error('Erro na chamada da PokeAPI:', error));

}


// chamada para exibição dos dados dos pokemons

pokeApi.getPokemons(0, 10).then(pokemonDetailsArray => {
    console.log('Primeiros 10 pokémons (Array completo):', pokemonDetailsArray);

    const ol = document.getElementById("ol"); // Garanta que você pega a OL aqui
    let generatedHtmlContent = ''; // Variável para acumular o HTML dos Pokémons reais

    // Iterar sobre o array de Pokémons recebidos e gerar o HTML para cada um
    pokemonDetailsArray.forEach(pokemon => {
        // As linhas de console.log que você tinha (e são úteis para depurar)
        console.log(`Nome do Pokémon: ${pokemon.name}`);
        console.log(`Número do Pokémon: ${pokemon.number}`);
        console.log(`Tipos do Pokémon: ${pokemon.types.join(', ')}`);
        console.log(`Foto do Pokémon: ${pokemon.photo}`);

        // AQUI: Chame PokemonToLi() e adicione o HTML resultante à string acumuladora
        generatedHtmlContent += PokemonToLi(pokemon);
    });

    // Depois de gerar o HTML para TODOS os Pokémons, insira-o na OL
    ol.innerHTML = generatedHtmlContent;

    console.log(`teste ver nome do pokemon`); // Esta linha se refere ao log anterior dos nomes

})
.catch(error => console.error('Erro ao exibir pokémons:', error));



searchType()
setupCardDetailsEvents()