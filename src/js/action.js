import { setupSearchTypeSelection } from './search_type.js';
import { setupCardDetailsEvents } from './card_details.js';
import { pokeApi } from './api_pokemon.js';
import { Pokemon } from './pokemon_model.js';

import { itemListInitial, PokemonToLi } from './structure_initial.js'


const htmlToSpinner = itemListInitial;
const pokemonLimit = 20;

// Variável para armazenar a lista completa de Pokémons (nome e URL básica)
let allPokemonBasicData = [];


// Função para RENDERIZAR APENAS OS POKÉMONS PADRÃO (SILHUETAS)
function renderPlaceholderPokemons(limit = pokemonLimit) {
    const ol = document.getElementById("ol");
    let generatedHtml = '';

    ol.innerHTML = '';

    for (let i = 0; i < limit; i++) {
        generatedHtml += PokemonToLi();
    }
    ol.innerHTML = generatedHtml;
}

// Função para CARREGAR E RENDERIZAR POKÉMONS REAIS DA API (lista ou específico)
async function loadAndRenderPokemons(pokemonPromise) {
    const ol = document.getElementById("ol");
    ol.innerHTML = htmlToSpinner; // Mostra spinner/placeholder enquanto carrega

    try {
        let pokemonsToRender;
        const result = await pokemonPromise; // Resolve a Promise
        
        if (Array.isArray(result)) { // Se for uma lista de Pokémons (ex: getPokemons)
            pokemonsToRender = result;
        } else if (result instanceof Pokemon) { // Se for um único Pokémon (ex: getPokemonByNameOrId)
            pokemonsToRender = [result];
        } else {
            // Se o resultado for nulo ou vazio e a busca exata não encontrou, renderiza placeholders
            console.warn("Nenhum Pokémon encontrado ou resultado inesperado. Exibindo placeholders.");
            renderPlaceholderPokemons();
            return;
        }

        let generatedHtml = '';
        if (pokemonsToRender && pokemonsToRender.length > 0) {
            pokemonsToRender.forEach(pokemon => {
                generatedHtml += PokemonToLi(pokemon); // Usa a função de structure_initial
            });
        } else {
            console.log("Nenhum Pokémon para renderizar. Exibindo placeholders.");
            generatedHtml = ''; // Limpa se não há Pokémons
            renderPlaceholderPokemons(); // Ou exibe placeholders novamente
            return;
        }
        ol.innerHTML = generatedHtml;

    } catch (error) {
        console.error("Erro ao carregar ou renderizar Pokémons:", error);
        ol.innerHTML = `<li class="error-message">Erro ao carregar Pokémons. Tente novamente mais tarde.<br>${error.message}</li>`;
        renderPlaceholderPokemons(); // Em caso de erro, volte para os placeholders
    }
}

// Variável para controlar o tipo de busca selecionado (para controle de validação)
let currentSearchType = null; 

// A função displayPokemonDetails é usada como callback para card_details.js
// Ela agora APENAS PREENCHE os elementos, não constrói o HTML do card.
async function displayPokemonDetails(pokemon) {
    const pokemonDetailsSection = document.getElementById("pokemon-details"); 

    // Seleciona os elementos pelos IDs que estão no structure_initial.js (cardDetailsInitial)
    const pokemonNameElement = pokemonDetailsSection.querySelector('#pokemon-name-detail');
    const pokemonNumberElement = pokemonDetailsSection.querySelector('#pokemon-number-detail');
    const pokemonPhotoElement = pokemonDetailsSection.querySelector('#pokemon-photo-detail');
    const typesContainer = pokemonDetailsSection.querySelector('#pokemon-types-container'); 
    const weightElement = pokemonDetailsSection.querySelector('#pokemon-weight-detail');
    const heightElement = pokemonDetailsSection.querySelector('#pokemon-height-detail');
    const abilitiesContainer = pokemonDetailsSection.querySelector('#pokemon-abilities-container'); 
    const descriptionElement = pokemonDetailsSection.querySelector('#pokemon-description-detail');
    const aboutSection = pokemonDetailsSection.querySelector('#about-section');
    const baseStatsSection = pokemonDetailsSection.querySelector('#base-stats-section'); 
    const statsNamesOl = pokemonDetailsSection.querySelector('#stats-names-ol');
    const statsValuesOl = pokemonDetailsSection.querySelector('#stats-values-ol');
    const statsSlidersOl = pokemonDetailsSection.querySelector('#stats-sliders-ol');


    // 1. Preencher Nome e Número
    if (pokemonNameElement) {
        pokemonNameElement.textContent = pokemon.name || 'Nome não disponível';
    }
    if (pokemonNumberElement) {
        pokemonNumberElement.textContent = `#${String(pokemon.number).padStart(3, '0')}` || '#???';
    }

    // 2. Preencher Imagem
    if (pokemonPhotoElement) {
        pokemonPhotoElement.src = pokemon.photo || './src/assets/img/Silhouette.png';
        pokemonPhotoElement.alt = pokemon.name || 'Pokémon Image';
    }
    
    // 3. Preencher Tipos e cores do card
    if (typesContainer) {
        const typesHtml = pokemon.types.map(type => `<span class="${type}">${type}</span>`).join('');
        typesContainer.innerHTML = typesHtml;
        // Ajusta a classe principal do card com base no tipo
        pokemonDetailsSection.className = `pokemon-details ${pokemon.type}`;
        // E também a cor das seções "About" e "Base Stats"
        if (aboutSection) aboutSection.className = `about ${pokemon.type}`;
        if (baseStatsSection) baseStatsSection.className = `about ${pokemon.type}`;
    }

    // 4. Preencher Peso e Altura
    if (weightElement) {
        weightElement.textContent = pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'N/A';
    }
    if (heightElement) {
        heightElement.textContent = pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'N/A';
    }

    // 5. Preencher Habilidades/Moves
    if (abilitiesContainer) {
        let abilitiesHtml = '<span>Não disponível</span>'; 
        if (pokemon.abilities && Array.isArray(pokemon.abilities) && pokemon.abilities.length > 0) {
            abilitiesHtml = pokemon.abilities
                .map(ability => {
                    if (ability && ability.name) {
                        return `<span>${ability.name.replace('-', ' ')}</span>`;
                    }
                    return '';
                })
                .filter(Boolean) // Remove strings vazias
                .join(' '); 
        }
        abilitiesContainer.innerHTML = abilitiesHtml;
    }

    // 6. Preencher Descrição
    if (descriptionElement) {
        descriptionElement.textContent = pokemon.description || 'Descrição não disponível.';
    }

    // 7. Preencher Stats
    if (statsNamesOl && statsValuesOl && statsSlidersOl && pokemon.stats && Array.isArray(pokemon.stats)) {
        let namesHtml = '';
        let valuesHtml = '';
        let slidersHtml = '';

        pokemon.stats.forEach(stat => {
            let statNameDisplay;
            switch(stat.stat.name) {
                case 'hp': statNameDisplay = 'HP'; break;
                case 'attack': statNameDisplay = 'ATK'; break;
                case 'defense': statNameDisplay = 'DEF'; break;
                case 'special-attack': statNameDisplay = 'SATK'; break;
                case 'special-defense': statNameDisplay = 'SDEF'; break;
                case 'speed': statNameDisplay = 'SPD'; break;
                default: statNameDisplay = stat.stat.name;
            }
            namesHtml += `<li>${statNameDisplay}</li>`;
            valuesHtml += `<li>${String(stat.base_stat).padStart(3, '0')}</li>`; // Formata com 3 dígitos

            const statId = stat.stat.name.replace(/-/g, ''); 
            const fillPercentage = (stat.base_stat / 255) * 100;

            slidersHtml += `<li><input type="range"
                                id="${statId}Slider"
                                min="0"
                                max="255"
                                step="1"
                                value="${stat.base_stat}"
                                disabled
                                style="--stat-fill-percentage: ${fillPercentage}%; --stat-type-color: var(--${pokemon.type}); --stat-type-color-light: var(--${pokemon.type}-light);"></li>`;
        });
        
        statsNamesOl.innerHTML = namesHtml;
        statsValuesOl.innerHTML = valuesHtml;
        statsSlidersOl.innerHTML = slidersHtml;
    }
}


// Funções de inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Renderiza os Pokémons padrão (silhuetas) na inicialização
    renderPlaceholderPokemons();

    // Carrega a lista básica de todos os Pokémons para o campo de busca
    try {
        allPokemonBasicData = await pokeApi.getAllPokemonBasicData();
    } catch (error) {
        console.error("Erro ao carregar lista básica de Pokémons:", error);
    }

    const searchInput = document.getElementById("iput");
    const searchButton = document.getElementById("btn-search"); // Adicione este ID no HTML para o botão de busca.

    // Desabilita o campo de busca e o botão de busca por padrão
    if (searchInput) {
        searchInput.disabled = true;
        searchInput.placeholder = 'Selecione o tipo de busca';
    }
    if (searchButton) {
        searchButton.disabled = true;
    }

    // Configura o seletor de tipo de busca
    setupSearchTypeSelection((selectedType) => {
        currentSearchType = selectedType; // Armazena o tipo de busca selecionado

        if (searchInput) {
            searchInput.disabled = false; // Habilita o campo de busca
            searchInput.value = ''; // Limpa o campo ao mudar o tipo
            if (selectedType === 'number') {
                searchInput.type = 'number';
                searchInput.placeholder = 'Buscar por número (ex: 25)';
            } else if (selectedType === 'name') {
                searchInput.type = 'text';
                searchInput.placeholder = 'Buscar por nome (ex: pikachu)';
            }
            // Foco no input após a seleção do tipo
            searchInput.focus(); 
        }
        if (searchButton) {
            searchButton.disabled = false; // Habilita o botão de busca
        }

        loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit)); 
    });

    

    // Listener para o clique no botão de busca
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();

            if (!searchTerm) { // Não faz a busca se o campo estiver vazio
                loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit)); 
                return;
            }

            
            if (currentSearchType === 'number') {
                // Converte para número e busca
                const pokemonNumber = parseInt(searchTerm, 10);
                if (!isNaN(pokemonNumber) && pokemonNumber > 0) {
                    loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(pokemonNumber));
                } else {
                    alert("Por favor, insira um número de Pokémon válido.");
                    renderPlaceholderPokemons();
                }
            } else if (currentSearchType === 'name') {
                // Busca por nome (API já lida com IDs também, mas aqui é para nome)
                loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(searchTerm.toLowerCase()));
            } else {
                alert("Por favor, selecione um tipo de busca (Número ou Nome).");
                renderPlaceholderPokemons();
            }
        });
    }


    // Listener para o evento 'keydown' no campo de busca (especificamente para 'Enter')
    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Impede o envio do formulário padrão
                const searchTerm = searchInput.value.trim();

                if (!searchTerm) { // Não faz a busca se o campo estiver vazio
                    loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
                    return;
                }

                if (currentSearchType === 'number') {
                    const pokemonNumber = parseInt(searchTerm, 10);
                    if (!isNaN(pokemonNumber) && pokemonNumber > 0) {
                        loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(pokemonNumber));
                    } else {
                        alert("Por favor, insira um número de Pokémon válido.");
                        loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
                    }
                } else if (currentSearchType === 'name') {
                    loadAndRenderPokemons(pokeApi.getPokemonByNameOrId(searchTerm.toLowerCase()));
                } else {
                    alert("Por favor, selecione um tipo de busca (Número ou Nome) antes de pesquisar.");
                    renderPlaceholderPokemons();
                }
            }
        });

        // Listener para o evento 'input' no campo de busca (busca "ao digitar" ou validação)
        searchInput.addEventListener('input', (event) => {
            if (currentSearchType === 'number') {
                // Permite apenas dígitos
                event.target.value = event.target.value.replace(/[^0-9]/g, '');
            } else if (currentSearchType === 'name') {
                // Permite letras, espaços e hífens para nomes de Pokémon
                event.target.value = event.target.value.replace(/[^a-zA-Z\s-]/g, '');
            }
            // Não chame loadAndRenderPokemons aqui diretamente para "live search" se a busca for por botão/Enter.
            // A busca agora é mais controlada.
        });
    } else {
        console.warn("Elemento 'input' com id='iput' não encontrado. Verifique seu HTML.");
    }
    
    // Configura os eventos para o card de detalhes, passando a função de renderização
    setupCardDetailsEvents(displayPokemonDetails, allPokemonBasicData);

    // Opcional: Carregar e renderizar os primeiros Pokémons da lista padrão
    // loadAndRenderPokemons(pokeApi.getPokemons(0, pokemonLimit));
});

// Exporta as funções que precisam ser acessíveis globalmente ou por outros módulos
export { loadAndRenderPokemons, displayPokemonDetails };