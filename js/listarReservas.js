import { db } from "./firebaseConfig.js"
import { getDocs, getDoc,setDoc, collection, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

async function buscarReservas() {
    const dadosBanco = await getDocs(collection(db, "reservas"))
    const reservas = []
    for (const doc of dadosBanco.docs) {
        reservas.push({ id: doc.id, ...doc.data() })
    }
    return reservas
}

const listaReservasDiv = document.getElementById("listar-reservas")

async function carregarListaDeReservas() {

    try {
        const reservas = await buscarReservas()
        console.log(reservas)
        renderizarListaDeReservas(reservas)
    } catch (error) {
        console.log("Erro ao buscar reservas: ", error)
        listaReservasDiv.innerHTML = '<p> Erro ao carregar reservas. Tente novamente mais tarde.</p>'
    }
}

function renderizarListaDeReservas(reservas) {
    listaReservasDiv.innerHTML = ''

    if (reservas.lenght === 0) {
        listaReservasDiv.innerHTML = '<p> Nenhuma reserva cadastrado ainda.</p>'
        return
    }

    for (let reserva of reservas) {
        const reservaDiv = document.createElement("div")
        reservaDiv.classList.add('reserva-item')
        reservaDiv.innerHTML = `
        <strong> Nome: </strong> ${reserva.nome} <br>
        <strong> Idade: </strong> ${reserva.idade} <br>
        <strong> Quantidade de pessoas: </strong> ${reserva.quantiaPessoas} <br>
        <strong> Quarto Desejado: </strong> ${reserva.quarto} <br>
        <strong> Data de Entrada: </strong> ${reserva.dataEntrada} <br>
        <strong> Data de Saída: </strong> ${reserva.dataSaida} <br>
        <strong> Telefone: </strong> ${reserva.telefone} <br>
        <strong> Email: </strong> ${reserva.email} <br>
        <strong> CPF: </strong> ${reserva.cpf} <br>
        <strong> Observações: </strong> ${reserva.observacoes} <br>
        <br>
        <button class="btn-Excluir" data-id="${reserva.id}"> Excluir </button>
        <button class="btn-Editar" data-id="${reserva.id}"> Editar </button>
        `
        listaReservasDiv.appendChild(reservaDiv)
    }
    addEventListener()
}

async function excluirReserva(idReserva) {
    try {
        const documentoDeletar = doc(db, "reservas", idReserva)
        await deleteDoc(documentoDeletar)
        console.log("Reserva com ID" + idReserva + "foi excluída")
    } catch (error) {
        console.log("Erro ao excluir reserva", error)
        alert("Erro ao excluir reserva. Tente novamente mais tarde.")
        return false;
    }
}

async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir')
    if (btnExcluir) {
        const certeza = confirm("Tem certeza que deseja excluir esta reserva?")
        if (certeza) {
            const idReserva = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirReserva(idReserva)

            if (exclusaoBemSucedida) {
                carregarListaDeReservas();
                alert("Reserva excluída com sucesso.")
            }
        } else {
            alert("Exclusão cancelada")
        }
    }
    const btnEditar = eventoDeClique.target.closest('.btn-Editar')
    if (btnEditar) {
        const idReserva = btnEditar.dataset.id;
        const reserva = await buscarReservasPorId(idReserva)

        const edicao = getValoresEditar()
        const editar = getValoresEditar()


        edicao.editarNome.value = reserva.nome
        edicao.editarIdade.value = reserva.idade
        edicao.editarQuantiaPessoas.value = reserva.quantiaPessoas
        edicao.editarQuarto.value = reserva.quarto
        edicao.editarDataEntrada.value = reserva.dataEntrada
        edicao.editarDataSaida.value = reserva.dataSaida
        edicao.editarTelefone.value = reserva.telefone
        edicao.editarEmail.value = reserva.email
        edicao.editarCpf.value = reserva.cpf
        edicao.editarObservacoes.value = reserva.observacoes
        editar.editarId.value = reserva.id

        edicao.formularioEdicao.style.display = 'block'

    }

}



function getValoresEditar() {
    return {
        editarNome: document.getElementById('editarNome'),
        editarIdade: document.getElementById('editarIdade'),
        editarQuantiaPessoas: document.getElementById('editarQuantiaPessoas'),
        editarQuarto: document.getElementById('editarQuarto'),
        editarDataEntrada: document.getElementById('editarDataEntrada'),
        editarDataSaida: document.getElementById('editarDataSaida'),
        editarTelefone: document.getElementById('editarTelefone'),
        editarEmail: document.getElementById('editarEmail'),
        editarCpf: document.getElementById('editarCpf'),
        editarObservacoes: document.getElementById('editarObservacoes'),
        editarId: document.getElementById('editarId'),
        formularioEdicao: document.getElementById('formularioEdicao')
    }
}

async function buscarReservasPorId(id) {
    try {
        const reservaDoc = doc(db, "reservas", id)
        const dadoAtual = await getDoc(reservaDoc)

        if (dadoAtual.exists()) {
            return { id: dadoAtual.id, ...dadoAtual.data() }
        } else {
            console.log("Nenhuma reserva encontrado com esse ID", id);
            return null;
        }
    } catch (error) {
        console.log("Erro ao buscar reserva por ID", error)
        alert("Erro ao buscar reserva. Tente novamente mais tarde.")
        return null;
    }
}

document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
    const edicao = getValoresEditar();
    const id = edicao.editarId.value;
    const novoDados = {
        nome: edicao.editarNome.value.trim(),
        idade: parseInt(edicao.editarIdade.value),
        quantiaPessoas: parseInt(edicao.editarQuantiaPessoas.value),
        quarto: edicao.editarQuarto.value.trim(),
        dataEntrada: edicao.editarDataEntrada.value,
        dataSaida: edicao.editarDataSaida.value,
        telefone: edicao.editarTelefone.value.trim(),
        email: edicao.editarEmail.value.trim(),
        cpf: edicao.editarCpf.value.trim(),
        observacoes: edicao.editarObservacoes.value.trim(),

    }
    try {
        const ref = doc(db, "reservas", id)
        await setDoc(ref, novoDados)
        alert("Reserva atualizado com sucesso.")
        edicao.formularioEdicao.style.display = 'none'
        carregarListaDeReservas()
    } catch (error) {
        console.log("Erro ao atualizar reserva", error)
        alert("Erro ao atualizar reserva. Tente novamente mais tarde.")
    }

})


function addEventListener() {
    listaReservasDiv.addEventListener("click", lidarClique)
}

document.addEventListener("DOMContentLoaded", carregarListaDeReservas)