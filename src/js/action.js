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

