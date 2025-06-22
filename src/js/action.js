const buttonSelect = document.getElementById("btn");
const boxSelectRadio = document.getElementById("select-radio");

buttonSelect.addEventListener('click', () => {  
    boxSelectRadio.classList.remove('hidden');
})

const radioNumber = document.getElementById('number');
const radioName = document.getElementById('name');

radioNumber.addEventListener("click", () =>{
    buttonSelect.innerHTML = `<span>#</span>`;
    buttonSelect.style.textDecoration = "none";
    boxSelectRadio.classList.add('hidden');

})

radioName.addEventListener('click', () => {
    buttonSelect.innerHTML = `<span>A</span>`;
    buttonSelect.style.textDecoration = "underline";
    boxSelectRadio.classList.add('hidden');
    
})

// ---------------------
const body = document.getElementById('body');
const header = document.getElementById('header');
const contentPokemon = document.getElementById('content-pokemon');
const pokemonDetails = document.getElementById("pokemon-details");
const pokemon = document.getElementById("pokemon");

pokemon.addEventListener("click", () => {
    body.classList.toggle("primary");
    header.classList.toggle("hidden");
    contentPokemon.classList.toggle("hidden");
    body.classList.toggle("gray-scale");
    pokemonDetails.classList.toggle('hidden')
})


const arrowBack = document.getElementById('arrow-back');
arrowBack.addEventListener('click', () => {
    body.classList.toggle("gray-scale");
    header.classList.toggle("hidden");
    contentPokemon.classList.toggle("hidden");
    body.classList.toggle("primary");
    pokemonDetails.classList.toggle('hidden')
})
