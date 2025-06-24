import { setupSearchTypeSelection } from './search_type.js';
import { setupCardDetailsEvents } from './card_details.js';
import { pokeApi } from './api_pokemon.js';


const htmlToSpinner = `
            <li class="pokemon-list">
                <span>#???</span>
                <img src="./src/assets/img/Silhouette.png" alt="Pokémon Silhouette">
                <span>Pokémon Name</span>
            </li>
        `;
const pokemonLimit = 100;
// Remover 'let searchTimeout;' pois vamos ignorar o timeout por enquanto

// Variável para armazenar a lista completa de Pokémons (nome e URL básica)
let allPokemonBasicData = [];

// 1. Função UNIFICADA para gerar o HTML de um Pokémon (REAL ou Placeholder)
function PokemonToLi(pokemon) {
    if (!pokemon || !pokemon.name) {
        // HTML para o placeholder (silhueta)
        return `
            <li class="pokemon-list">
                <span>#???</span>
                <img src="./src/assets/img/Silhouette.png" alt="Pokémon Silhouette">
                <span>Pokémon Name</span>
            </li>
        `;
    }

    // HTML para o Pokémon real (com dados)
    return `
        <li class="pokemon-list ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <span class="name">${pokemon.name}</span>
        </li>
    `;
}

// 2. Função para RENDERIZAR APENAS OS POKÉMONS PADRÃO (SILHUETAS)
function renderPlaceholderPokemons(limit = pokemonLimit) {
    const ol = document.getElementById("ol");
    let generatedHtml = '';

    ol.innerHTML = '';
    console.log(`Exibindo ${limit} Pokémons padrão (silhuetas).`);

    for (let i = 0; i < limit; i++) {
        generatedHtml += PokemonToLi();
    }
    ol.innerHTML = generatedHtml;
}

// 3. Função para CARREGAR E RENDERIZAR POKÉMONS REAIS DA API (lista ou específico)
// AGORA ELA RECEBE UMA PROMISE DIRETAMENTE para ser mais flexível.
function loadAndRenderPokemons(pokemonsToDisplayPromise) {
    const ol = document.getElementById("ol");
    const loadingSpinner = document.getElementById("loading-spinner");

    ol.innerHTML = ''; // Limpa antes de carregar
    if (loadingSpinner) {
        // loadingSpinner.classList.remove('hidden'); 
        ol.innerHTML = htmlToSpinner;
    } else {

        // renderPlaceholderPokemons(pokemonLimit);
        ol.innerHTML = htmlToSpinner;
    }
    console.log('Iniciando carregamento e renderização de Pokémons...');

    pokemonsToDisplayPromise
        .then(result => {
            setTimeout(() => {
                // if (loadingSpinner) {
                //     loadingSpinner.classList.add('hidden');
                // }

                const pokemonArray = Array.isArray(result) ? result : [result];
                let generatedHtmlContent = '';

                if (pokemonArray && pokemonArray.length > 0 && pokemonArray[0] && pokemonArray[0].name) {
                    pokemonArray.forEach(pokemon => {
                        generatedHtmlContent += PokemonToLi(pokemon);
                    });
                    ol.innerHTML = generatedHtmlContent;
                    console.log(`Exibindo ${pokemonArray.length} Pokémon(s) real(is) da API.`);
                } else {
                    console.warn("Nenhum Pokémon encontrado para exibir.");
                    ol.innerHTML = '<li>Nenhum Pokémon encontrado.</li>';
                }
            }, 500);
        })
        .catch(error => {
            setTimeout(() => {
                // if (loadingSpinner) {
                //     loadingSpinner.classList.add('hidden');
                // }
                console.error('Erro ao exibir Pokémons:', error);
                ol.innerHTML = `<li>${error.message || 'Ocorreu um erro ao carregar os Pokémons.'}</li>`;
            }, 500);
        });
}


// ***** INICIALIZAÇÃO DA APLICAÇÃO QUANDO O DOM ESTÁ PRONTO *****
document.addEventListener('DOMContentLoaded', () => {

    setupCardDetailsEvents();

    const ol = document.getElementById("ol"); // Referência para a lista OL

    // 1. Carrega a lista básica de TODOS os Pokémons UMA ÚNICA VEZ
    // (Útil para futuras expansões ou para a busca "começa com")
    pokeApi.getAllPokemonBasicData()
        .then(data => {
            allPokemonBasicData = data;
            console.log(`Lista básica de ${allPokemonBasicData.length} Pokémons carregada para busca local.`);
            
            // *** MUDANÇA AQUI: Renderiza as silhuetas na inicialização ***
            renderPlaceholderPokemons(pokemonLimit); 
        })
        .catch(error => {
            console.error("Erro ao carregar a lista básica de Pokémons. A busca pode não funcionar como esperado.", error);
            ol.innerHTML = '<li>Erro ao carregar dados iniciais. Tente novamente.</li>';
        });


    const searchInput = document.getElementById('iput');
    const searchButton = document.getElementById('btn');

    setupSearchTypeSelection(
        (selectedType) => {
            console.log('*** Callback de Seleção de Tipo Acionado ***');
            console.log(`O tipo de busca selecionado AGORA é: ${selectedType}`);

            if (searchInput) {
                searchInput.value = ''; // Limpa o input de busca ao mudar o tipo
            }

            // Quando seleciona um tipo, carrega a lista padrão (primeiros [pokemonLimit-> quantidade que for informada] Pokémons reais)
            if (selectedType === 'number' || selectedType === 'name') {
                console.log(`--> O usuário selecionou "${selectedType}". Carregando lista padrão de Pokémons.`);
                loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
            } else {
                console.log('--> Tipo de busca desconhecido ou não selecionado. Exibindo mensagem inicial.');
                // Se algo inesperado acontecer no tipo de busca, volta para as silhuetas
                renderPlaceholderPokemons(pokemonLimit); 
            }
        }
    );

    if (searchButton && searchInput) {
        // Listener para o clique no botão (aciona busca exata, se houver termo)
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log(`Busca exata acionada por botão para: ${searchTerm}`);
                loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(searchTerm));
            } else {
                console.log("Campo de busca vazio. O botão 'Sort' abrirá/fechará os filtros.");
            }
        });

        // Listener para a tecla ENTER no campo de busca (aciona busca exata, se houver termo)
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    console.log(`Busca exata acionada por ENTER para: ${searchTerm}`);
                    loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(searchTerm));
                } else {
                    console.log("Pressionado ENTER com campo de busca vazio. Recarregando lista padrão.");
                    loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
                }
            }
        });

        // Listener para o evento 'input' no campo de busca (busca "ao digitar")
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.trim();

            if (searchTerm.length >= 1) {
                console.log(`Live search por: "${searchTerm}" (busca exata)`);
                loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(searchTerm));
            } else if (searchTerm.length === 0) {
                console.log("Campo de busca vazio. Recarregando lista padrão de Pokémons.");
                loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
            }
        });

    } else {
        console.warn("Elemento 'input' com id='iput' ou 'button' com id='btn' não encontrado. Verifique seu HTML.");
    }
});