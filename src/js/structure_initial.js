const itemListInitial = `
            <li class="pokemon-list">
                <span>#???</span>
                <img src="./src/assets/img/Silhouette.png" alt="Pokémon Silhouette">
                <span>Pokémon Name</span>
            </li>
        `

const cardDetailsInitial = `<div class="content-details">
                
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
                <span></span>
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

function PokemonToLi(pokemon) {
    if (!pokemon || !pokemon.name) {
        // HTML para o placeholder (silhueta)
        return itemListInitial;
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


export { itemListInitial, PokemonToLi , cardDetailsInitial };