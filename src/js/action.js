import { setupSearchTypeSelection } from './search_type.js';
import { setupCardDetailsEvents } from './card_details.js';
import { pokeApi } from './api_pokemon.js';
import { Pokemon } from './pokemon_model.js'; // Importar Pokemon model para uso na função de detalhes

const htmlToSpinner = `
            <li class="pokemon-list">
                <span>#???</span>
                <img src="./src/assets/img/Silhouette.png" alt="Pokémon Silhouette">
                <span>Pokémon Name</span>
            </li>
        `;
const pokemonLimit = 10;

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
    // const loadingSpinner = document.getElementById("loading-spinner"); // Removido, pois não é usado de fato para mostrar/esconder

    ol.innerHTML = ''; // Limpa antes de carregar
    ol.innerHTML = htmlToSpinner; // Mostra o spinner/placeholder enquanto carrega

    console.log('Iniciando carregamento e renderização de Pokémons...');

    pokemonsToDisplayPromise
        .then(result => {
            setTimeout(() => { // Adicionado um pequeno delay para a UX do spinner
                const pokemonArray = Array.isArray(result) ? result : [result];
                let generatedHtmlContent = '';

                if (pokemonArray && pokemonArray.length > 0 && pokemonArray[0] instanceof Pokemon) { // Verifica se é instância de Pokemon
                    pokemonArray.forEach(pokemon => {
                        generatedHtmlContent += PokemonToLi(pokemon);
                    });
                    ol.innerHTML = generatedHtmlContent;
                    console.log(`Exibindo ${pokemonArray.length} Pokémon(s) real(is) da API.`);
                } else {
                    console.warn("Nenhum Pokémon encontrado ou dados inválidos para exibir.");
                    ol.innerHTML = '<li>Nenhum Pokémon encontrado.</li>';
                }
            }, 500);
        })
        .catch(error => {
            setTimeout(() => { // Adicionado um pequeno delay
                console.error('Erro ao exibir Pokémons:', error);
                ol.innerHTML = `<li>${error.message || 'Ocorreu um erro ao carregar os Pokémons.'}</li>`;
            }, 500);
        });
}

// Função para construir o HTML dos detalhes do Pokémon (chamada por card_details.js)
// Esta função é o 'displayPokemonDetailsCallback' passado para setupCardDetailsEvents
async function displayPokemonDetails(pokemon) {
    const pokemonDetailsSection = document.getElementById("pokemon-details"); 
    const typesHtml = pokemon.types.map(type => `<span class="${type}">${type}</span>`).join('');
    
    if (!pokemon || !pokemon.name) {

        return pokemonDetailsSection.innerHTML +=   `<div class="content-details">
                
                <div class="box-one-details">
                    <span id="arrow-back">
                        <img src="https://img.icons8.com/?size=100&id=357&format=png&color=ffffff" alt="ico arrow back">
                
                    </span>
                    <span>
                        <h1>Pokémon Name</h1>
                    </span>
                    <span>#999</span>
                </div>

                <div class="box-second-details">
                    <span><img src="https://img.icons8.com/?size=100&id=w4iYfd3Qeyn6&format=png&color=ffffff" alt="ico chevron left"></span>
                    <span><img src="https://img.icons8.com/?size=100&id=dK72mTJ1Cf8b&format=png&color=ffffff" alt="ico chevron right"></span>
                </div>

                <div class="box-third-details">
                    <img src="./src/assets/img/Silhouette.png" alt="image Silhouette">
                </div>
                
            </div>

            <div class="details">

                <div class="type">
                    <span>Type</span>
                    <span>Type</span>
                </div>
                
                <div class="about gray-scale">
                    <span>About</span>
                </div>

                <div class="ability">
                    <div>
                        <span>
                            <img src="./src/assets/ico/weight.svg" alt="weight">
                            <span>9,9 kg</span>
                        </span>

                        <span>Weight</span>
                    </div>

                    <div>
                        <span>
                            <img src="./src/assets/ico/straighten.svg" alt="straighten">
                            <span>9,9 m</span>
                        </span>

                        <span>Height</span>
                    </div>

                    <div>
                        <span>
                            <span>Ability 1 Ability 2</span>
                        </span>

                        <span>Moves</span>
                    </div>

                </div>

                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis eros vitae tellus condimentum maximus sit amet in eros.
                </p>

                <div class="about gray-scale"><span>Base Stats</span></div>

                <div class="frame">
                    <ol>
                        <li>HP</li>
                        <li>ATK</li>
                        <li>DEF</li>
                        <li>SATK</li>
                        <li>SDEF</li>
                        <li>SPD</li>
                    </ol>

                    <span></span>

                    <ol>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                    </ol>

                    <ol>
                        <li><input type="range" id="hpSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="atkSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="defSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="satkSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="sdefSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="spdSlider" min="0" max="100" step="0.01" value="50"></li>
                    </ol>

                </div>

            </div>
            `
    }

    // aqui é pra trazer juntos com os dados da api passado pela class 
    return pokemonDetailsSection.innerHTML += `<div class="content-details">
                
                <div class="box-one-details">
                    <span id="arrow-back">
                        <img src="https://img.icons8.com/?size=100&id=357&format=png&color=ffffff" alt="ico arrow back">
                
                    </span>
                    <span>
                        <h1>${pokemon.name}</h1>
                    </span>
                    <span>##${pokemon.number}</span>
                </div>

                <div class="box-second-details">
                    <span><img src="https://img.icons8.com/?size=100&id=w4iYfd3Qeyn6&format=png&color=ffffff" alt="ico chevron left"></span>
                    <span><img src="https://img.icons8.com/?size=100&id=dK72mTJ1Cf8b&format=png&color=ffffff" alt="ico chevron right"></span>
                </div>

                <div class="box-third-details">
                    <img src="${pokemon.photo}" alt="#${pokemon.name}">
                </div>
                
            </div>

            <div class="details">

                <div class="type">
                    ${typesHtml}
                    
                </div>
                
                <div class="about ${pokemon.type}">
                    <span>About</span>
                </div>

                <div class="ability">
                    <div>
                        <span>
                            <img src="./src/assets/ico/weight.svg" alt="weight">
                            <span>${pokemon.weight} kg</span>
                        </span>

                        <span>Weight</span>
                    </div>

                    <div>
                        <span>
                            <img src="./src/assets/ico/straighten.svg" alt="straighten">
                            <span>${pokemon.height} m</span>
                        </span>

                        <span>Height</span>
                    </div>

                    <div>
                        <span>
                            <span>Ability 1 Ability 2</span>
                        </span>

                        <span>Moves</span>
                    </div>

                </div>

                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis eros vitae tellus condimentum maximus sit amet in eros.
                </p>

                <div class="about gray-scale"><span>Base Stats</span></div>

                <div class="frame">
                    <ol>
                        <li>HP</li>
                        <li>ATK</li>
                        <li>DEF</li>
                        <li>SATK</li>
                        <li>SDEF</li>
                        <li>SPD</li>
                    </ol>

                    <span></span>

                    <ol>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                        <li>999</li>
                    </ol>

                    <ol>
                        <li><input type="range" id="hpSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="atkSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="defSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="satkSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="sdefSlider" min="0" max="100" step="0.01" value="50"></li>
                        <li><input type="range" id="spdSlider" min="0" max="100" step="0.01" value="50"></li>
                    </ol>

                </div>

            </div>
            `

}


// ***** INICIALIZAÇÃO DA APLICAÇÃO QUANDO O DOM ESTÁ PRONTO *****
document.addEventListener('DOMContentLoaded', () => {

    const ol = document.getElementById("ol"); // Referência para a lista OL

    // 1. Carrega a lista básica de TODOS os Pokémons UMA ÚNICA VEZ
    pokeApi.getAllPokemonBasicData()
        .then(data => {
            allPokemonBasicData = data;
            console.log(`Lista básica de ${allPokemonBasicData.length} Pokémons carregada para busca local.`);
            
            // Passa a função de preenchimento do card E a lista de dados básicos para setupCardDetailsEvents
            setupCardDetailsEvents(displayPokemonDetails, allPokemonBasicData); 
            
            // Renderiza as silhuetas na inicialização
            renderPlaceholderPokemons(pokemonLimit); 
        })
        .catch(error => {
            console.error("Erro ao carregar a lista básica de Pokémons. A busca pode não funcionar como esperado.", error);
            ol.innerHTML = '<li>Erro ao carregar dados iniciais. Tente novamente.</li>';
            // Se houver erro ao carregar dados básicos, ainda inicialize o setup de eventos para não quebrar tudo
            setupCardDetailsEvents(displayPokemonDetails, []); // Passa array vazio em caso de erro
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
        // CORRIGIDO: Esta mensagem agora reflete os IDs corretos que você usa no actions.js (iput e btn)
        console.warn("Elemento 'input' com id='iput' ou 'button' com id='btn' não encontrado. Verifique seu HTML.");
    }
});