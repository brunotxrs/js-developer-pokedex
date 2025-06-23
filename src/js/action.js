import { setupSearchTypeSelection } from './search_type.js';
import { setupCardDetailsEvents } from './card_details.js';
import { pokeApi } from './api_pokemon.js';

const pokemonLimit = 10;

// 1. Função UNIFICADA para gerar o HTML de um Pokémon (REAL ou Placeholder)
// Esta função fica aqui, fora de qualquer if/else, e será usada por todas as lógicas de exibição.
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
            <span>#${pokemon.number}</span>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <span>${pokemon.name}</span>
        </li>
    `;
}

// 2. Função para RENDERIZAR APENAS OS POKÉMONS PADRÃO (SILHUETAS)
// Esta função é simples e apenas gera os placeholders.
function renderPlaceholderPokemons(limit = pokemonLimit) {
    const ol = document.getElementById("ol");
    let generatedHtml = '';

    ol.innerHTML = ''; // Limpa antes de adicionar as silhuetas
    console.log(`Exibindo ${limit} Pokémons padrão (silhuetas).`);

    for (let i = 0; i < limit; i++) {
        generatedHtml += PokemonToLi(); // Chama PokemonToLi sem argumento para gerar placeholder
    }
    ol.innerHTML = generatedHtml;
}

// 3. Função para CARREGAR E RENDERIZAR POKÉMONS REAIS DA API (lista ou específico)
// Esta função faz a chamada à API e renderiza os resultados.
function loadAndRenderPokemons(offset = 0, limit = pokemonLimit, searchTerm = '') {
    const ol = document.getElementById("ol");
    let generatedHtmlContent = '';

    ol.innerHTML = '<li>Carregando Pokémons...</li>'; // Feedback visual
    console.log(`Buscando Pokémons: Termo '${searchTerm}', Offset ${offset}, Limite ${limit}.`);

    let apiPromise;
    if (searchTerm) {
        apiPromise = pokeApi.getPokemonByNameOrId(searchTerm);
    } else {
        apiPromise = pokeApi.getPokemons(offset, limit);
    }

    apiPromise
        .then(result => {
            // Se for busca por nome/id, 'result' será um único Pokémon.
            // Se for lista, 'result' será um array de Pokémons.
            const pokemonArray = Array.isArray(result) ? result : [result];

            if (pokemonArray && pokemonArray.length > 0 && pokemonArray[0] && pokemonArray[0].name) {
                generatedHtmlContent = ''; // Limpa para os novos resultados
                pokemonArray.forEach(pokemon => {
                    // console.log(`Pokémon: ${pokemon.name}, #${pokemon.number}, Tipos: ${pokemon.types.join(', ')}, Foto: ${pokemon.photo}`);
                    generatedHtmlContent += PokemonToLi(pokemon); // Chama PokemonToLi com os dados reais
                });
                ol.innerHTML = generatedHtmlContent;
                console.log(`Exibindo ${pokemonArray.length} Pokémon(s) real(is) da API.`);
            } else {
                console.warn("Nenhum Pokémon encontrado para exibir.");
                ol.innerHTML = '<li>Nenhum Pokémon encontrado.</li>';
            }
        })
        .catch(error => {
            console.error('Erro ao exibir Pokémons:', error);
            ol.innerHTML = `<li>${error.message || 'Ocorreu um erro ao carregar os Pokémons.'}</li>`;
        });
}


// ***** INICIALIZAÇÃO DA APLICAÇÃO QUANDO O DOM ESTÁ PRONTO *****
document.addEventListener('DOMContentLoaded', () => {

    // 1. Configura os eventos de abertura/fechamento do card de detalhes
    setupCardDetailsEvents();

    // 2. Renderiza os Pokémons padrão (silhuetas) ao carregar a página
    renderPlaceholderPokemons(pokemonLimit); // Exibe quantidade silhuetas como estado inicial

    // Pegar referências dos elementos de busca (IDs do seu HTML)
    const searchInput = document.getElementById('iput');
    const searchButton = document.getElementById('btn'); // O botão 'Sort' que abre/fecha os rádios


    // 3. Configura os eventos dos botões de seleção de tipo de busca (Number/Name)
    // O callback é chamado quando o usuário seleciona um rádio.
    setupSearchTypeSelection(
        (selectedType) => {
            console.log('*** Callback de Seleção de Tipo Acionado ***');
            console.log(`O tipo de busca selecionado AGORA é: ${selectedType}`);

            // AQUI ESTÁ SUA LÓGICA DESEJADA, agora de forma limpa:
            if (selectedType === 'number') {
                console.log('--> O usuário selecionou "Number".');
                // Quando seleciona 'Number', carregamos a lista padrão (sem termo de busca)
                loadAndRenderPokemons(0, pokemonLimit, ''); // Carrega 10 primeiros por número/ordem
                if (searchInput) searchInput.value = ''; // Limpa o input de busca
            } else if (selectedType === 'name') {
                console.log('--> O usuário selecionou "Name".');
                // Quando seleciona 'Name', também carregamos a lista padrão (sem termo de busca)
                loadAndRenderPokemons(0, pokemonLimit, ''); // Carrega 10 primeiros por número/ordem
                if (searchInput) searchInput.value = ''; // Limpa o input de busca
            } else {
                // Este 'else' geralmente só seria ativado se selectedType fosse vazio ou inesperado.
                // Na sua lógica anterior, você usava " " (string vazia com espaço), que não deve ocorrer.
                console.log('--> Tipo de busca desconhecido ou não selecionado. Exibindo placeholders e lista padrão.');
                renderPlaceholderPokemons(pokemonLimit); // Volta para silhuetas se algo inesperado acontecer
                loadAndRenderPokemons(0, pokemonLimit, ''); // E tenta carregar a lista padrão
            }
        }
    );

    // 4. Listener para o botão de busca (ID 'btn') e tecla ENTER no input 'iput'
    if (searchButton && searchInput) {
        // Listener para o clique no botão (se houver termo de busca, ele aciona a busca)
        searchButton.addEventListener('click', () => {
            const currentSearchType = document.querySelector('input[name="searchOption"]:checked')?.value || 'number';
            const searchTerm = searchInput.value.trim();

            if (searchTerm) {
                // Se houver um termo, realiza a busca específica
                loadAndRenderPokemons(0, 1, searchTerm); // Carrega 1 Pokémon específico (ou o que a API retornar para aquele termo)
            } else {
                // Se o campo de busca estiver vazio, apenas a lógica de abrir/fechar filtros será ativada pelo 'btn'
                console.log("Campo de busca vazio. O botão 'Sort' agora abrirá/fechará os filtros.");
            }
        });

        // Listener para a tecla ENTER no campo de busca
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Impede o envio de formulário
                const currentSearchType = document.querySelector('input[name="searchOption"]:checked')?.value || 'number';
                const searchTerm = searchInput.value.trim();

                if (searchTerm) {
                    loadAndRenderPokemons(0, 1, searchTerm); // Busca específica
                } else {
                    console.log("Pressionado ENTER com campo de busca vazio. Carregando lista padrão.");
                    loadAndRenderPokemons(0, pokemonLimit, ''); // Carrega a lista padrão
                }
            }
        });

    } else {
        console.warn("Elemento 'input' com id='iput' ou 'button' com id='btn' não encontrado. Verifique seu HTML.");
    }

});