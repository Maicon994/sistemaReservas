import { db } from "./firebaseConfig.js"
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


function getInput() {
    return {
        nome: document.getElementById("nome"),
        idade: document.getElementById("idade"),
        quantiaPessoas: document.getElementById("quantiaPessoas"),
        quarto: document.getElementById("quartoDesejado"),
        dataEntrada: document.getElementById("dataEntrada"),
        dataSaida: document.getElementById("dataSaida"),
        telefone: document.getElementById("telefone"),
        email: document.getElementById("email"),
        cpf: document.getElementById("cpf"),
        observacoes: document.getElementById("observacoes"),

    }
}

function getValores({ nome, idade, cargo, quantiaPessoas, quarto, dataEntrada, dataSaida, telefone, email, cpf, observacoes }) {
    return {
        nome: nome.value.trim(),
        idade: parseInt(idade.value),
        quantiaPessoas: parseInt(quantiaPessoas.value),
        quarto: quarto.value.trim(),
        dataEntrada: dataEntrada.value,
        dataSaida: dataSaida.value,
        telefone: telefone.value.trim(),
        email: email.value.trim(),
        cpf: cpf.value.trim(),
        observacoes: observacoes.value.trim(),        
    }
}
document.getElementById("btnEnviar").addEventListener("click", async function(){
     const input = getInput()
     const dados = getValores(input)

    console.log(dados)

    try {
      const ref = await  addDoc(collection(db, "reservas"), dados)
      console.log("ID do documento", ref.id)
      alert("Reserva cadastrado com sucesso!")
    } catch (e){
        console.log("Erro:", e)

    }
})