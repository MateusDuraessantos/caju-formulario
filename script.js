/* Scripts do formulário */
const valName = (e) => {
  e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '')
}
const valFuncionarios = (e) => {
  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '') // Remove tudo que não for número
}

const valNumero = (e) => {
  let val = e.currentTarget.value.replace(/\D/g, ''); 
  if (val.length > 11) val = val.slice(0, 11); // Limita a 11 dígitos (formato máximo)
  let formatado = '';
  if (val.length > 0) formatado += `(${val.slice(0, 2)}`; // Adiciona o DDD
  if (val.length >= 3) formatado += `) ${val.slice(2, 7)}`; // Adiciona a primeira parte
  if (val.length >= 8) formatado += `-${val.slice(7, 11)}`; // Adiciona a segunda parte

  e.currentTarget.value = formatado;
}

const inputs = document.querySelectorAll(".form__input, .form__select");
inputs.forEach(input => { // Criar elementos de erro para cada campo
  
  const errorElement = document.createElement("p");
  errorElement.classList.add("form__error");
  errorElement.style.display = "none";
  input.parentElement.appendChild(errorElement);
});

const funcDOMContentLoaded = (e) => {
  
  const submitButton = document.querySelector(".form__submit")
  submitButton.addEventListener("click", (event) => {

    inputs.forEach(input => {
      
      const errorElement = input.parentElement.querySelector(".form__error");
      errorElement.style.display = "none";
      errorElement.textContent = "";
      const container = input.closest(".form__inputCtn");
      
      validadorInputs(input, container, errorElement)

      input.addEventListener('click', () => {
        container.classList.remove('form__error-err')
        errorElement.style.display = 'none'
      }) // Remove o erro ao clicar novamente no input

    });

  });
}

const message = {
  ['valName']: "* Nome é obrigatório",
  ['valEmail']: "* Nome é obrigatório",
  ['valTrabalho']: "* Seu cargo é obrigatório",
  ['valCargo']: "* Nome é obrigatório",
  ['valNumero']: "* Nome é obrigatório",
  ['valEmpresa']: "* Nome é obrigatório",
  ['valFuncionarios']: "* Nome é obrigatório",
  ['valDesafio']: "* Seu cargo é obrigatório",
}

const validadorInputs = (input, container, errorElement) => {
  let isValid = true
    if (input.id === "valEmail" && !validateEmail(input.value)) { // input
      container.classList.add('form__error-err')
      errorElement.textContent = "* Nome é obrigatório";
      errorElement.style.display = "block";
      isValid = false;
    } else if (input.id === "valNumero" && validateTelefone(input.value)) { // input
      container.classList.add('form__error-err')
      errorElement.textContent = "* Nome é obrigatório";
      errorElement.style.display = "block";
      isValid = false;
    } else if (input.value == '') { // Seletor
      container.classList.add('form__error-err')
      errorElement.textContent = message[input.id];
      errorElement.style.display = "block";
      isValid = false;
    }

    if (!isValid) event.preventDefault();
}

const validateTelefone = (telefone) => {
  return !(telefone.replace(/\D/g, '').length == 11)
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById("valName").addEventListener("input", valName);
document.getElementById("valFuncionarios").addEventListener("input", valFuncionarios);
document.getElementById("valNumero").addEventListener("input", valNumero);
document.addEventListener("DOMContentLoaded", funcDOMContentLoaded);

const inputsxxx = document.querySelectorAll(".form__input, .form__select");
inputsxxx.forEach(obj => {
  console.log('obj', obj.parentElement.querySelector(".form__error"));
  const element = obj.value
  const errorElement = obj.parentElement.querySelector(".form__error")
  const container = obj.closest(".form__inputCtn")
  
  obj.addEventListener('blur', (elem) => {
    validadorInputs(obj, container, errorElement)
  })

  obj.addEventListener('click', (elem) => {
    container.classList.remove('form__error-err')
    errorElement.style.display = 'none'
  })
})
