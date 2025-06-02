const inputNome = document.getElementById("nomeIntegrante");
const tabelaIntegrantes = document.getElementById("tabelaIntegrantes");
const btnIniciarProjeto = document.getElementById("btnIniciarProjeto");

const nomeTarefa = document.getElementById("nomeTarefa");
const descricaoTarefa = document.getElementById("descricaoTarefa");
const responsavelTarefa = document.getElementById("responsavelTarefa");
const dataTarefa = document.getElementById("dataTarefa");
const tabelaTarefas = document.getElementById("tabelaTarefas");

const filtroStatus = document.getElementById("filtroStatus");
const filtroResponsavel = document.getElementById("filtroResponsavel");

const totalTarefasSpan = document.getElementById("totalTarefas");
const tarefasConcluidasSpan = document.getElementById("tarefasConcluidas");
const tarefasPendentesSpan = document.getElementById("tarefasPendentes");

let integrantes = [];
let tarefas = [];

function adicionarIntegrante() {
  const nome = inputNome.value.trim();
  if (nome === "") return;
  if (integrantes.length >= 5) return;

  integrantes.push(nome);
  inputNome.value = "";
  atualizarTabelaIntegrantes();
  salvarDados();
}

function atualizarTabelaIntegrantes() {
  tabelaIntegrantes.innerHTML = "";
  integrantes.forEach((nome) => {
    const linha = tabelaIntegrantes.insertRow();
    linha.insertCell(0).textContent = nome;
  });
  btnIniciarProjeto.disabled = integrantes.length === 0;
  atualizarSelectResponsaveis();
}

function iniciarProjeto() {
  alert("Projeto iniciado!");
}

function atualizarSelectResponsaveis() {
  responsavelTarefa.innerHTML = '<option value="">Selecione</option>';
  filtroResponsavel.innerHTML = '<option value="">Todos</option>';

  integrantes.forEach((nome) => {
    const option1 = document.createElement("option");
    option1.value = nome;
    option1.textContent = nome;
    responsavelTarefa.appendChild(option1);

    const option2 = option1.cloneNode(true);
    filtroResponsavel.appendChild(option2);
  });
}

function adicionarTarefa() {
  const nome = nomeTarefa.value.trim();
  const descricao = descricaoTarefa.value.trim();
  const responsavel = responsavelTarefa.value;
  const data = dataTarefa.value;

  if (!nome || !descricao || !responsavel || !data) return;

  const tarefa = {
    nome,
    descricao,
    responsavel,
    data,
    status: "Pendente"
  };

  tarefas.push(tarefa);
  atualizarTabelaTarefas();
  salvarDados();

  nomeTarefa.value = "";
  descricaoTarefa.value = "";
  responsavelTarefa.value = "";
  dataTarefa.value = "";
}

function atualizarTabelaTarefas() {
  const statusSelecionado = filtroStatus.value;
  const responsavelSelecionado = filtroResponsavel.value;

  tabelaTarefas.innerHTML = "";

  tarefas.forEach((tarefa, index) => {
    const correspondeStatus = !statusSelecionado || tarefa.status === statusSelecionado;
    const correspondeResponsavel = !responsavelSelecionado || tarefa.responsavel === responsavelSelecionado;

    if (correspondeStatus && correspondeResponsavel) {
      const linha = tabelaTarefas.insertRow();

      linha.insertCell(0).textContent = tarefa.nome;
      linha.insertCell(1).textContent = tarefa.descricao;
      linha.insertCell(2).textContent = tarefa.responsavel;
      linha.insertCell(3).textContent = tarefa.data;
      linha.insertCell(4).textContent = tarefa.status;

      const celulaAcoes = linha.insertCell(5);
      celulaAcoes.innerHTML = `
        <button onclick="concluirTarefa(${index})">Concluir</button>
        <button onclick="excluirTarefa(${index})">Excluir</button>
      `;
    }
  });

  atualizarEstatisticas();
}

function concluirTarefa(index) {
  tarefas[index].status = "Concluída";
  atualizarTabelaTarefas();
  salvarDados();
}

function excluirTarefa(index) {
  tarefas.splice(index, 1);
  atualizarTabelaTarefas();
  salvarDados();
}

function atualizarEstatisticas() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.status === "Concluída").length;
  const pendentes = tarefas.filter(t => t.status === "Pendente").length;

  totalTarefasSpan.textContent = total;
  tarefasConcluidasSpan.textContent = concluidas;
  tarefasPendentesSpan.textContent = pendentes;
}

function salvarDados() {
  localStorage.setItem("integrantes", JSON.stringify(integrantes));
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarDados() {
  const dadosIntegrantes = localStorage.getItem("integrantes");
  const dadosTarefas = localStorage.getItem("tarefas");

  if (dadosIntegrantes) {
    integrantes = JSON.parse(dadosIntegrantes);
    atualizarTabelaIntegrantes();
  }

  if (dadosTarefas) {
    tarefas = JSON.parse(dadosTarefas);
    atualizarTabelaTarefas();
  }
}

filtroStatus.addEventListener("change", atualizarTabelaTarefas);
filtroResponsavel.addEventListener("change", atualizarTabelaTarefas);

window.addEventListener("load", carregarDados);
