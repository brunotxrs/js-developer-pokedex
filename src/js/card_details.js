function setupCardDetailsEvents() { 
    
    const body = document.getElementById('body');
    const header = document.getElementById('header');
    const contentPokemon = document.getElementById('content-pokemon');
    const pokemonDetails = document.getElementById("pokemon-details");
    const ol = document.getElementById("ol"); 
    ol.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.pokemon-list'); 
        if (clickedItem) {

            body.classList.toggle("primary");
            header.classList.toggle("hidden");
            contentPokemon.classList.toggle("hidden");
            body.classList.toggle("gray-scale");
            pokemonDetails.classList.toggle('hidden');


        }
    });

    const arrowBack = document.getElementById('arrow-back');
    arrowBack.addEventListener('click', () => {
        body.classList.toggle("gray-scale");
        header.classList.toggle("hidden");
        contentPokemon.classList.toggle("hidden");
        body.classList.toggle("primary");
        pokemonDetails.classList.toggle('hidden');
    });

}


export { setupCardDetailsEvents };