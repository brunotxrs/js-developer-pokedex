import { pokeApi } from './api_pokemon.js';


let currentPokemonData = null; // Para armazenar os dados do Pokémon atualmente exibido no card
let currentPokemonIndexInAllData = -1; // Para ajudar na navegação anterior/próximo
let allPokemonBasicDataGlobal = []; // Para armazenar a lista completa de Pokémons para navegação


// Esta função agora aceita `displayPokemonDetailsCallback` como um parâmetro.
// Ela será responsável por BUSCAR os detalhes do Pokémon clicado e então chamará o callback
// para renderizar o HTML dinamicamente.
// Adicionado allPokemonBasicData como parâmetro para navegação
function setupCardDetailsEvents(displayPokemonDetailsCallback, allPokemonBasicData) { 
    
    const body = document.getElementById('body');
    const header = document.getElementById('header');
    const contentPokemon = document.getElementById('content-pokemon');
    const pokemonDetailsSection = document.getElementById("pokemon-details"); 
    const ol = document.getElementById("ol"); 

    allPokemonBasicDataGlobal = allPokemonBasicData; // Armazena a lista de Pokémons globalmente

    // Função interna para exibir os detalhes e configurar os listeners dinâmicos
    async function showPokemonDetails(pokemonId) {
        try {
            // Esconde a lista e mostra a seção de detalhes
            body.classList.remove("primary"); // Remove primary
            body.classList.add("gray-scale"); // Adiciona gray-scale para o fundo da tela de detalhes
            header.classList.add("hidden");
            contentPokemon.classList.add("hidden");
            pokemonDetailsSection.classList.remove('hidden'); // Mostra a seção de detalhes

            // Busca os detalhes completos do Pokémon
            const pokemonData = await pokeApi.getPokemonByNameOrId(pokemonId); 
            console.log('Detalhes do Pokémon:', pokemonData);

            const pokemonDescription = await pokeApi.getPokemonDescription(pokemonId); // <--- NOVA LINHA
            pokemonData.description = pokemonDescription; // <--- NOVA LINHA

            // Armazena o Pokémon atual para navegação futura
            currentPokemonData = pokemonData;
            // Encontra o índice do Pokémon atual na lista completa de dados básicos
            currentPokemonIndexInAllData = allPokemonBasicDataGlobal.findIndex(p => p.number == pokemonData.number);


            // Chama a função de callback para PREENCHER o HTML do card de detalhes
            if (displayPokemonDetailsCallback) {
                displayPokemonDetailsCallback(pokemonData);
            }

            // APLICAR A COR DO TIPO PRINCIPAL AO BACKGROUND DA SEÇÃO DE DETALHES
            // O ideal é que `pokemon-details` receba a classe do tipo
            // e o CSS lide com a cor.
            pokemonDetailsSection.className = `pokemon-details ${pokemonData.type}`;
            // Certifique-se que seu CSS tenha algo como: .pokemon-details.grass { background-color: var(--grass); }
            // Ou que a cor seja aplicada diretamente no elemento com a classe content-details (já está no actions.js)


            // ATENÇÃO: Adicionar event listeners para os botões dinâmicos AGORA.
            // Eles só existem no DOM depois que displayPokemonDetailsCallback injeta o HTML.
            const arrowBackDetail = document.getElementById('arrow-back'); 
            if (arrowBackDetail) {
                // Usando onclick para sobrescrever eventuais listeners anteriores e evitar duplicação
                arrowBackDetail.onclick = () => { 
                    pokemonDetailsSection.innerHTML = '';
                    console.log("Clicado em voltar do detalhe.");
                    body.classList.remove("gray-scale"); // Remove gray-scale
                    body.classList.add("primary"); // Volta a cor primary
                    header.classList.remove("hidden");
                    contentPokemon.classList.remove("hidden");
                    pokemonDetailsSection.classList.add('hidden'); // Esconde a seção de detalhes
                    pokemonDetailsSection.className = `pokemon-details hidden`; // Limpa a classe de tipo
                    currentPokemonData = null; // Resetar
                    currentPokemonIndexInAllData = -1; // Resetar
                };
            } else {
                console.warn("Elemento #arrow-back-detail não encontrado após injeção do HTML.");
            }

            // Lógica para chevrons (esquerda/direita)
            const chevronLeft = document.getElementById('chevron-left');
            const chevronRight = document.getElementById('chevron-right');

            if (chevronLeft) {
                chevronLeft.onclick = async () => {
                    if (currentPokemonIndexInAllData > 0) {
                        // Navega para o Pokémon anterior
                        const previousPokemonBasic = allPokemonBasicDataGlobal[currentPokemonIndexInAllData - 1];
                        await showPokemonDetails(previousPokemonBasic.number); 
                    } else {
                        console.log("Já no primeiro Pokémon da lista.");
                        // Opcional: Voltar para o último da lista se quiser um loop
                        // await showPokemonDetails(allPokemonBasicDataGlobal[allPokemonBasicDataGlobal.length - 1].number);
                    }
                };
            }

            if (chevronRight) {
                chevronRight.onclick = async () => {
                    if (currentPokemonIndexInAllData < allPokemonBasicDataGlobal.length - 1) {
                        // Navega para o próximo Pokémon
                        const nextPokemonBasic = allPokemonBasicDataGlobal[currentPokemonIndexInAllData + 1];
                        await showPokemonDetails(nextPokemonBasic.number); 
                    } else {
                        console.log("Já no último Pokémon da lista.");
                        // Opcional: Voltar para o primeiro da lista se quiser um loop
                        // await showPokemonDetails(allPokemonBasicDataGlobal[0].number);
                    }
                };
            }

        } catch (error) {
            console.error(`Erro ao carregar detalhes do Pokémon ${pokemonId}:`, error);
            // Garante que a seção esteja visível para mostrar o erro, mas restaura o estado anterior se falhar
            pokemonDetailsSection.classList.remove('hidden'); 
            const detailsContent = document.getElementById("pokemon-details-content");
            if (detailsContent) {
                detailsContent.innerHTML = `<div class="error-message">Ocorreu um erro ao carregar os detalhes do Pokémon ${pokemonId}.<br>${error.message}</div>`;
            }
            // Reverta a visibilidade e classes se a abertura falhar completamente
            body.classList.remove("gray-scale");
            body.classList.add("primary");
            header.classList.remove("hidden");
            contentPokemon.classList.remove("hidden");
            pokemonDetailsSection.classList.add('hidden'); // Esconde a seção de detalhes novamente
            pokemonDetailsSection.className = `pokemon-details hidden`; // Limpa a classe de tipo
        }
    }


    // Listener principal para o clique nos itens da lista OL
    ol.addEventListener('click', async (event) => { 
        const clickedItem = event.target.closest('.pokemon-list'); 
        if (clickedItem) {
            const pokemonId = clickedItem.dataset.pokemonId;
            await showPokemonDetails(pokemonId); // Chama a função que faz tudo
            
        }
    });

    // Removido o event listener fixo para 'arrowBack' pois ele é agora adicionado dinamicamente
}

export { setupCardDetailsEvents };