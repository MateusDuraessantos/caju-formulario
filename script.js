  // Função para obter parâmetros UTM da URL
  function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParameters = {};
    utmParameters["str_utm_source"] = urlParams.get("utm_source") || "";
    utmParameters["str_utm_medium"] = urlParams.get("utm_medium") || "";
    utmParameters["str_utm_campaign"] = urlParams.get("utm_campaign") || "";
    utmParameters["str_utm_term"] = urlParams.get("utm_term") || "";
    return utmParameters;
}

document.addEventListener("DOMContentLoaded", function () {

  let measurement_id__c = 'G-3RPJSREWE0'

  let client_id__c = function get_ga_clientid() {
      var cookie = {};
      document.cookie.split(';').forEach(function (el) {
          var splitCookie = el.split('=');
          var key = splitCookie[0].trim();
          var value = splitCookie[1];
          cookie[key] = value;
      });
      return cookie["_ga"].substring(6);
  }

  var cookie = {};
  document.cookie.split(';').forEach(function (el) {
      var splitCookie = el.split('=');
      var key = splitCookie[0].trim();
      var value = splitCookie[1];
      cookie[key] = value;
  });
  cookie["_ga"].substring(6)
  function get_ga_clientid() {
      var cookie = {};
      document.cookie.split(';').forEach(function (el) {
          var splitCookie = el.split('=');
          var key = splitCookie[0].trim();
          var value = splitCookie[1];
          cookie[key] = value;
      });
      return cookie["_ga"].substring(6);
  }

  let botaoEnviar = document.getElementById("submitButton");
  botaoEnviar.addEventListener("click", function (e) {
      e.preventDefault();

      let isSomethingMissing = false

      inputs.forEach(input => {
        const errorElement = input.parentElement.querySelector(".form__error")
        errorElement.style.display = "none"
        errorElement.textContent = ""
        const container = input.closest(".form__inputCtn")
        
        isSomethingMissing = validadorInputs(input, container, errorElement)
        
        input.addEventListener('click', () => { // Remove o erro ao clicar novamente no input
          container.classList.remove('form__error-err')
          errorElement.style.display = 'none'
        })
      })

      const checkboxs = document.querySelector('input[name="option_cliente"]:checked')
      
      if (isSomethingMissing || checkboxs == null) {
        alert('Preencha todos os campos antes de processeguir')
        return // Caso esteja faltando algo, impede a função de seguir
      }

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const cargo = document.getElementById('cargo').value;
      const telefone = document.getElementById('telefone').value;
      const empresa = document.getElementById('empresa').value;
      const colaboradores = document.getElementById('colaboradores').value;
      const option_cliente = document.querySelector('input[name="option_cliente"]:checked')
  

    
      // Formatar a data e hora no padrão brasileiro
      let dataHoraFormatada = new Date().toLocaleString("pt-BR");
      if (
          !telefone ||
          telefone.length < 10
      ) {
          alert("Por favor, verifique o número de telefone!");
          return;
      }
      if (
          !nome ||
          !email ||
          !cargo ||
          !empresa ||
          !option_cliente ||
          !colaboradores
          

          ) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
      }
      if (/0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}/.test(telefone.replace(/\D/g, '').substring(0, 11))) {
          alert('O número de telefone está inválido!')
          return
      }
      if (!(/^\S+@\S+\.\S+$/.test(email))) {
          alert('O e-mail está inválido!')
          return
      }
      const utmParameters = getUTMParameters()
      const data = JSON.stringify({
          str_lp_name: 'Manual do PAT - 2025',
          str_user_name: nome,
          str_email: email,
          str_cargo: cargo,
          nr_phone: telefone.replace(/\D/g, ''),
          str_company_name: empresa,
          str_employees_number: colaboradores,
          fl_Client: option_cliente.value,
          dt_created_date: dataHoraFormatada,
          measurement_id__c: measurement_id__c,
          client_id__c: client_id__c(),
          ...utmParameters// Inclui os parâmetros UTM mapeados corretamente
      });

      fetch("https://conteudo.caju.com.br/integracao-pat-2025", {
          method: "POST",
          body: data,
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          }
      })
          .then(resposta => resposta.text())
          .then((resposta) => {
              const json = JSON.parse(resposta.replace("System.Collections.ArrayList", ""))
              if (json.statusCode === 200) {
                  if (typeof dataLayer !== 'undefined') {
                      dataLayer.push({
                          event: "e_003_001_001_059_018_001",
                          parameters: {
                              email_domain: domainEmail(email)
                          }
                      });
                  }
                  window.location.href = "https://conteudo.caju.com.br/ebook-pat-2025-a-caminho";
              } else {
                  alert("Erro ao inserir dados.");
              }
          }).catch(err => console.log(err));
  });
});

//split email domain

function domainEmail(email) {
  const dominios = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'yahoo.com',
      'icloud.com',
      'aol.com',
      'live.com',
      'protonmail.com',
      'mail.com',
      'gmx.com',
      'zoho.com',
      'me.com',
      'yandex.com',
      'msn.com',
      'fastmail.com'
  ]
  let emailDomain = email.split('@')[1]
  if (dominios.includes(emailDomain)) {
      return 'personal'
  } else {
      return 'corp'
  }

}
//input colaboradores, para não permitir letras/caracteres especiais e delimitar a quantidade de números inseridos
function onlyNumber(input) {
  input.value = input.value.replace(/[a-zA-Z]/g, "").replace(/\D/g, '');
  if (input.value < 1) {
      input.value = ''
      return
  }

}

document.getElementById('nome').addEventListener('input', (event) => {
  // Remove todos os caracteres que não são letras
  const regex = /[0-9]/g;
  event.target.value = event.target.value.replace(regex, '').replace(/[!@#$%^&\(\)\_\=\+\-\¨\<\,\>\.\:\;\~\}\]\[\´\{\**]/g, "");

});

// Função para validar e formatar o campo de TELEFONE
function formatarTelefone(input) {
  let telefone = input.value;
  // Remover todos os caracteres não numéricos
  telefone = telefone.replace(/\D/g, '');
  // Limitar para no máximo 11 dígitos (DDD + número)
  telefone = telefone.substring(0, 11);
  // Não permitir números sequencias
  if (/0{11}|1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}/.test(telefone)) {
      alert('O número de telefone está inválido!')
      return
  }
  let formattedTelefone;
  if (telefone.length >= 11) {
      formattedTelefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else {
      formattedTelefone = telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");//não permitir o caracteres especiais
  }
  // Atualizar o valor do campo de telefone
  input.value = formattedTelefone;
};



function validacaoEmail(email) {

  usuario = email.value.substring(0, email.value.indexOf("@"));
  dominio = email.value.substring(email.value.indexOf("@") + 1, email.value.length);

  if (!(/^\S+@\S+\.\S+$/.test(email.value))) {
      alert('O e-mail está inválido!')
      return
  }
}








/* Scripts do formulário */

const message = {
  ['nome']: "* Nome é obrigatório",
  ['email']: "* Nome é obrigatório",
  ['valTrabalho']: "* Seu cargo é obrigatório",
  ['cargo']: "* Nome é obrigatório",
  ['telefone']: "* Nome é obrigatório",
  ['empresa']: "* Nome é obrigatório",
  ['colaboradores']: "* Nome é obrigatório",
  ['valDesafio']: "* Seu cargo é obrigatório",
}

const validadorInputs = (input, container, errorElement) => {
  let isValid = false
  
  if (input.id === "email" && !validateEmail(input.value)) { // input
    container.classList.add('form__error-err')
    errorElement.textContent = "* Nome é obrigatório"
    errorElement.style.display = "block"
    isValid = true
  } else if (input.id === "telefone" && validateTelefone(input.value)) { // input
    container.classList.add('form__error-err')
    errorElement.textContent = "* Nome é obrigatório"
    errorElement.style.display = "block"
    isValid = true
  } else if (input.value == '') { // Seletor
    container.classList.add('form__error-err')
    errorElement.textContent = message[input.id]
    errorElement.style.display = "block"
    isValid = true
  }
  return isValid
}

const validateTelefone = (telefone) => !(telefone.replace(/\D/g, '').length == 11)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const inputs = document.querySelectorAll(".form__input, .form__select")
inputs.forEach(input => { // Criar elementos de erro para cada campo
  
  const errorElement = document.createElement("p")
  errorElement.classList.add("form__error")
  errorElement.style.display = "none"
  input.parentElement.appendChild(errorElement)

  errorElement.parentElement.querySelector(".form__error")
  const container = input.closest(".form__inputCtn")
  
  input.addEventListener('blur', () => {
    validadorInputs(input, container, errorElement)
  })

  input.addEventListener('click', () => {
    container.classList.remove('form__error-err')
    errorElement.style.display = 'none'
  })
  
})
document.getElementById("nome").addEventListener("input", (e) => {
  e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '')
})

document.getElementById("colaboradores").addEventListener("input", (e) => {
  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '') // Remove tudo que não for número
})

document.getElementById("telefone").addEventListener("input", (e) => {
  let val = e.currentTarget.value.replace(/\D/g, '') 
  if (val.length > 11) val = val.slice(0, 11) // Limita a 11 dígitos
  let formatado = ''
  if (val.length > 0) formatado += `(${val.slice(0, 2)}` // Adiciona o DDD
  if (val.length >= 3) formatado += `) ${val.slice(2, 7)}` // Adiciona a primeira parte
  if (val.length >= 8) formatado += `-${val.slice(7, 11)}` // Adiciona a segunda parte

  e.currentTarget.value = formatado
})