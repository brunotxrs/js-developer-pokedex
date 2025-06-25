function setupSearchTypeSelection(onSearchTypeChangeCallback) { 
    const buttonSelect = document.getElementById("btn");
    const boxSelectRadio = document.getElementById("select-radio");

    const radioOptions = document.querySelectorAll('input[name="searchOption"]');

    if (!buttonSelect) { console.error("Elemento #btn não encontrado."); return; }
    if (!boxSelectRadio) { console.error("Elemento #select-radio não encontrado."); return; }
    if (radioOptions.length === 0) { console.error("Nenhum rádio com name='searchOption' encontrado."); return; }


    buttonSelect.addEventListener('click', () => {
        boxSelectRadio.classList.remove('hidden'); 
    });

    radioOptions.forEach(radio => {
        radio.addEventListener('change', (event) => {
            boxSelectRadio.classList.add('hidden');
            const selectedSearchType = event.target.value;

            if (onSearchTypeChangeCallback && typeof onSearchTypeChangeCallback === 'function') {
                onSearchTypeChangeCallback(selectedSearchType);
            }

            if (selectedSearchType === 'number') {
                buttonSelect.innerHTML = `<span>#</span>`;
                buttonSelect.style.textDecoration = "none";
            } else if (selectedSearchType === 'name') {
                buttonSelect.innerHTML = `<span>A</span>`;
                buttonSelect.style.textDecoration = "underline";
            }
        });
    });
}

export { setupSearchTypeSelection };