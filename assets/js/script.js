const CHAVE_ARMAZENAMENTO = "gerenciador-filmes:obras";
const CHAVE_MENSAGEM = "gerenciador-filmes:mensagem";

const TIPOS = {
  filme: "Filme",
  serie: "Série",
};

const STATUS = {
  "quero-assistir": { rotulo: "Quero Assistir", classe: "status-planned" },
  assistindo: { rotulo: "Assistindo", classe: "status-watching" },
  concluido: { rotulo: "Concluído", classe: "status-completed" },
  abandonado: { rotulo: "Abandonado", classe: "status-abandoned" },
};

// Obras exibidas na primeira visita, iguais às da tabela estática do index.html.
const OBRAS_INICIAIS = [
  { id: "duna-parte-dois", titulo: "Duna: Parte Dois", tipo: "filme", genero: "Ficção Científica", ano: 2024, status: "concluido", avaliacao: 5, favorito: true, observacoes: "" },
  { id: "ruptura", titulo: "Ruptura", tipo: "serie", genero: "Drama", ano: 2022, status: "assistindo", avaliacao: 4, favorito: true, observacoes: "" },
  { id: "parasita", titulo: "Parasita", tipo: "filme", genero: "Suspense", ano: 2019, status: "concluido", avaliacao: 5, favorito: false, observacoes: "" },
  { id: "the-bear", titulo: "The Bear", tipo: "serie", genero: "Comédia dramática", ano: 2022, status: "quero-assistir", avaliacao: null, favorito: false, observacoes: "" },
  { id: "dark", titulo: "Dark", tipo: "serie", genero: "Ficção Científica", ano: 2017, status: "abandonado", avaliacao: 3, favorito: false, observacoes: "" },
  { id: "o-castelo-animado", titulo: "O Castelo Animado", tipo: "filme", genero: "Animação", ano: 2004, status: "quero-assistir", avaliacao: 4, favorito: true, observacoes: "" },
];

// Somente esta obra possui páginas próprias de detalhes e edição.
const OBRA_COM_PAGINAS = "duna-parte-dois";

function carregarObras() {
  try {
    const salvas = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (salvas) {
      return JSON.parse(salvas);
    }
  } catch (erro) {
    console.warn("Não foi possível ler as obras salvas.", erro);
  }
  return OBRAS_INICIAIS.map((obra) => ({ ...obra }));
}

function salvarObras(obras) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(obras));
  } catch (erro) {
    console.warn("Não foi possível salvar as obras.", erro);
  }
}

function gerarId(titulo) {
  const base = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "obra"}-${Date.now()}`;
}

function criarElemento(tag, texto, classe) {
  const elemento = document.createElement(tag);
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  if (classe) {
    elemento.className = classe;
  }
  return elemento;
}

function criarCelulaAvaliacao(avaliacao) {
  const celula = document.createElement("td");
  if (!avaliacao) {
    celula.textContent = "Não avaliado";
    return celula;
  }
  const estrelas = criarElemento("span", "★".repeat(avaliacao) + "☆".repeat(5 - avaliacao));
  estrelas.setAttribute("aria-hidden", "true");
  celula.append(
    estrelas,
    criarElemento("span", `${avaliacao} de 5 estrelas`, "visually-hidden"),
    " ",
    criarElemento("span", `(${avaliacao}/5)`, "rating-text"),
  );
  return celula;
}

function criarAcoes(obra) {
  const acoes = criarElemento("div", undefined, "table-actions");

  if (obra.id === OBRA_COM_PAGINAS) {
    const detalhes = criarElemento("a", "Detalhes");
    detalhes.href = "pages/detalhes.html";
    detalhes.setAttribute("aria-label", `Ver detalhes de ${obra.titulo}`);
    const editar = criarElemento("a", "Editar");
    editar.href = "pages/editar.html";
    editar.setAttribute("aria-label", `Editar ${obra.titulo}`);
    acoes.append(detalhes, editar);
  } else {
    const detalhes = criarElemento("button", "Detalhes");
    detalhes.type = "button";
    detalhes.disabled = true;
    detalhes.setAttribute("aria-label", `Detalhes de ${obra.titulo} indisponíveis nesta demonstração`);
    const editar = criarElemento("button", "Editar");
    editar.type = "button";
    editar.disabled = true;
    editar.setAttribute("aria-label", `Edição de ${obra.titulo} indisponível nesta demonstração`);
    acoes.append(detalhes, editar);
  }

  const excluir = criarElemento("button", "Excluir", "button-danger");
  excluir.type = "button";
  excluir.dataset.excluir = obra.id;
  excluir.setAttribute("aria-label", `Excluir ${obra.titulo}`);
  acoes.append(excluir);

  const celula = document.createElement("td");
  celula.append(acoes);
  return celula;
}

function criarLinha(obra) {
  const linha = document.createElement("tr");
  const status = STATUS[obra.status];

  const titulo = criarElemento("th", obra.titulo);
  titulo.scope = "row";

  const celulaStatus = document.createElement("td");
  celulaStatus.append(criarElemento("span", status.rotulo, `status ${status.classe}`));

  linha.append(
    titulo,
    criarElemento("td", TIPOS[obra.tipo]),
    criarElemento("td", obra.genero),
    criarElemento("td", String(obra.ano)),
    celulaStatus,
    criarCelulaAvaliacao(obra.avaliacao),
    criarElemento("td", obra.favorito ? "Sim" : "Não"),
    criarAcoes(obra),
  );
  return linha;
}

function renderizarColecao(obras) {
  const corpo = document.querySelector("#lista-obras");
  const contador = document.querySelector("#contador-obras");

  const linhas = obras.map(criarLinha);
  if (linhas.length === 0) {
    const vazia = document.createElement("tr");
    const celula = criarElemento("td", "Nenhuma obra cadastrada. Use “Cadastrar nova obra” para começar.");
    celula.colSpan = 8;
    vazia.append(celula);
    linhas.push(vazia);
  }
  corpo.replaceChildren(...linhas);

  contador.textContent = obras.length === 1 ? "1 obra" : `${obras.length} obras`;
}

function anunciar(texto) {
  const mensagem = document.querySelector("#mensagem-colecao");
  if (mensagem) {
    mensagem.textContent = texto;
  }
}

function iniciarColecao() {
  let obras = carregarObras();
  renderizarColecao(obras);

  const pendente = sessionStorage.getItem(CHAVE_MENSAGEM);
  if (pendente) {
    anunciar(pendente);
    sessionStorage.removeItem(CHAVE_MENSAGEM);
  }

  document.querySelector("#lista-obras").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-excluir]");
    if (!botao) {
      return;
    }
    const obra = obras.find((item) => item.id === botao.dataset.excluir);
    if (!obra || !confirm(`Excluir “${obra.titulo}” da coleção?`)) {
      return;
    }
    obras = obras.filter((item) => item.id !== obra.id);
    salvarObras(obras);
    renderizarColecao(obras);
    anunciar(`“${obra.titulo}” foi excluída da coleção.`);
  });
}

function iniciarCadastro() {
  const formulario = document.querySelector("#form-cadastro");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formulario);
    const titulo = dados.get("titulo").trim();
    const genero = dados.get("genero").trim();
    const avaliacao = dados.get("avaliacao");

    if (!titulo || !genero) {
      formulario.querySelector(titulo ? "#genero" : "#titulo").focus();
      return;
    }

    const obra = {
      id: gerarId(titulo),
      titulo,
      tipo: dados.get("tipo"),
      genero,
      ano: Number(dados.get("ano")),
      status: dados.get("status"),
      avaliacao: avaliacao ? Number(avaliacao) : null,
      favorito: dados.has("favorito"),
      observacoes: dados.get("observacoes").trim(),
    };

    const obras = carregarObras();
    obras.push(obra);
    salvarObras(obras);
    sessionStorage.setItem(CHAVE_MENSAGEM, `“${obra.titulo}” foi cadastrada na coleção.`);
    window.location.href = "../index.html";
  });
}

if (document.querySelector("#lista-obras")) {
  iniciarColecao();
}

if (document.querySelector("#form-cadastro")) {
  iniciarCadastro();
}
