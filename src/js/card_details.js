import { pokeApi } from './api_pokemon.js';
import { cardDetailsInitial } from './structure_initial.js';

let currentPokemonData = null;
let currentPokemonIndexInAllData = -1;
let allPokemonBasicDataGlobal = [];
// Cache para armazenar os detalhes completos dos Pokémons já visitados
const pokemonDetailsCache = {};

function setupCardDetailsEvents(displayPokemonDetailsCallback, allPokemonBasicData) {
    const body = document.getElementById('body');
    const header = document.getElementById('header');
    const contentPokemon = document.getElementById('content-pokemon');
    const pokemonDetailsSection = document.getElementById("pokemon-details");
    const ol = document.getElementById("ol");

    allPokemonBasicDataGlobal = allPokemonBasicData;

    async function showPokemonDetails(pokemonId) {
        try {
            // CORREÇÃO: Limpa o conteúdo da seção de detalhes ANTES de carregar.
            pokemonDetailsSection.innerHTML = ''; // Garante que não haja sobreposição

            pokemonDetailsSection.innerHTML = cardDetailsInitial; 

            body.classList.remove("primary");
            body.classList.add("gray-scale");
            header.classList.add("hidden");
            contentPokemon.classList.add("hidden");
            pokemonDetailsSection.classList.remove('hidden');

            let pokemonData;
            // Verifica o cache antes de ir na API
            if (pokemonDetailsCache[pokemonId]) {
                
                pokemonData = pokemonDetailsCache[pokemonId];
                
            } else {
                
                pokemonData = await pokeApi.getPokemonByNameOrId(pokemonId);
                const pokemonDescription = await pokeApi.getPokemonDescription(pokemonId);
                pokemonData.description = pokemonDescription;
                pokemonDetailsCache[pokemonId] = pokemonData; // Armazena no cache
                
            }

            console.log('Detalhes do Pokémon:', pokemonData);

            // currentPokemonData é o objeto Pokémon COMPLETO (com 'number')
            currentPokemonData = pokemonData;
            
            // pois a lista global é a referência para navegar.
            currentPokemonIndexInAllData = allPokemonBasicDataGlobal.findIndex(p => {
                // Extrai o ID da URL do Pokémon básico na lista global para comparar com o número do Pokémon completo
                const basicPokemonIdFromUrl = p.url.split('/').filter(Boolean).pop();
                return basicPokemonIdFromUrl == pokemonData.number;
            });


            if (displayPokemonDetailsCallback) {
                displayPokemonDetailsCallback(pokemonData);
            }

            pokemonDetailsSection.className = `pokemon-details ${pokemonData.type}`;

            const arrowBackDetail = document.getElementById('arrow-back');
            if (arrowBackDetail) {
                arrowBackDetail.onclick = () => {
                    pokemonDetailsSection.innerHTML = '';
                    console.log("Clicado em voltar do detalhe.");
                    body.classList.remove("gray-scale");
                    body.classList.add("primary");
                    header.classList.remove("hidden");
                    contentPokemon.classList.remove("hidden");
                    pokemonDetailsSection.classList.add('hidden');
                    pokemonDetailsSection.className = `pokemon-details hidden`;
                    currentPokemonData = null;
                    currentPokemonIndexInAllData = -1;
                };
            } else {
                console.warn("Elemento #arrow-back-detail não encontrado após injeção do HTML.");
            }

            const chevronLeft = document.getElementById('chevron-left');
            const chevronRight = document.getElementById('chevron-right');

            if (chevronLeft) {
                chevronLeft.onclick = async () => {
                    if (currentPokemonIndexInAllData > 0) {
                        const previousPokemonBasic = allPokemonBasicDataGlobal[currentPokemonIndexInAllData - 1];
                        // *** CORREÇÃO AQUI: Extrai o ID da URL ***
                        const prevId = previousPokemonBasic.url.split('/').filter(Boolean).pop();
                        await showPokemonDetails(prevId);
                    } else {
                        console.log("Já no primeiro Pokémon da lista.");
                    }
                };
            }

            if (chevronRight) {
                chevronRight.onclick = async () => {
                    if (currentPokemonIndexInAllData < allPokemonBasicDataGlobal.length - 1) {
                        const nextPokemonBasic = allPokemonBasicDataGlobal[currentPokemonIndexInAllData + 1];
                        // *** CORREÇÃO AQUI: Extrai o ID da URL ***
                        const nextId = nextPokemonBasic.url.split('/').filter(Boolean).pop();
                        await showPokemonDetails(nextId);
                    } else {
                        console.log("Já no último Pokémon da lista.");
                    }
                };
            }

        } catch (error) {
            console.error(`Erro ao carregar os detalhes do Pokémon ${pokemonId}:`, error);
            const displayId = pokemonId !== undefined && pokemonId !== null ? pokemonId : 'indefinido';
            pokemonDetailsSection.innerHTML = `<div class="error-message">Ocorreu um erro ao carregar os detalhes do Pokémon ${displayId}.<br>${error.message}</div>`;
            pokemonDetailsSection.classList.remove('hidden');

            body.classList.remove("primary");
            body.classList.add("gray-scale");
            header.classList.add("hidden");
            contentPokemon.classList.add("hidden");

            pokemonDetailsSection.className = `pokemon-details gray-scale-error`;
        }
    }

    ol.addEventListener('click', async (event) => {
        const clickedItem = event.target.closest('.pokemon-list');
        if (clickedItem) {
            const pokemonId = clickedItem.dataset.pokemonId;
            if (pokemonId) { // Garante que há um ID antes de tentar mostrar detalhes
                await showPokemonDetails(pokemonId);
            } else {
                console.warn("Elemento clicado não possui data-pokemon-id.");
            }
        }
    });
}

export { setupCardDetailsEvents };