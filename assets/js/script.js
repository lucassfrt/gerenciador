const CHAVE_ARMAZENAMENTO = "gerenciador-filmes:obras";
const CHAVE_MENSAGEM = "gerenciador-filmes:mensagem";
const TIPOS = { filme: "Filme", serie: "Série" };
const STATUS = {
  "quero-assistir": { rotulo: "Quero Assistir", classe: "status-planned" },
  assistindo: { rotulo: "Assistindo", classe: "status-watching" },
  concluido: { rotulo: "Concluído", classe: "status-completed" },
  abandonado: { rotulo: "Abandonado", classe: "status-abandoned" },
};
const OBRAS_INICIAIS = [
  { id: "duna-parte-dois", titulo: "Duna: Parte Dois", tipo: "filme", genero: "Ficção Científica", ano: 2024, status: "concluido", avaliacao: 5, favorito: true, observacoes: "" },
  { id: "ruptura", titulo: "Ruptura", tipo: "serie", genero: "Drama", ano: 2022, status: "assistindo", avaliacao: 4, favorito: true, observacoes: "" },
  { id: "parasita", titulo: "Parasita", tipo: "filme", genero: "Suspense", ano: 2019, status: "concluido", avaliacao: 5, favorito: false, observacoes: "" },
  { id: "the-bear", titulo: "The Bear", tipo: "serie", genero: "Comédia dramática", ano: 2022, status: "quero-assistir", avaliacao: null, favorito: false, observacoes: "" },
  { id: "dark", titulo: "Dark", tipo: "serie", genero: "Ficção Científica", ano: 2017, status: "abandonado", avaliacao: 3, favorito: false, observacoes: "" },
  { id: "o-castelo-animado", titulo: "O Castelo Animado", tipo: "filme", genero: "Animação", ano: 2004, status: "quero-assistir", avaliacao: 4, favorito: true, observacoes: "" },
];

function carregarObras() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO));
    if (Array.isArray(dados)) return dados;
  } catch (erro) { console.warn("Não foi possível ler as obras salvas.", erro); }
  const iniciais = OBRAS_INICIAIS.map((obra) => ({ ...obra }));
  salvarObras(iniciais);
  return iniciais;
}
function salvarObras(obras) {
  try { localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(obras)); return true; }
  catch (erro) { console.error("Não foi possível salvar as obras.", erro); return false; }
}
function gerarId(titulo) {
  const slug = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "obra"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function el(tag, texto, classe) {
  const node = document.createElement(tag);
  if (texto !== undefined) node.textContent = texto;
  if (classe) node.className = classe;
  return node;
}
function anunciar(texto) {
  const alvo = document.querySelector("#mensagem-colecao, [data-feedback]");
  if (alvo) alvo.textContent = texto;
}
function salvarMensagem(texto) { sessionStorage.setItem(CHAVE_MENSAGEM, texto); }
function obterFormulario(obra, id) {
  const form = document.querySelector(id);
  const campos = new FormData(form);
  const avaliacao = campos.get("avaliacao");
  return { ...obra, titulo: campos.get("titulo").trim(), tipo: campos.get("tipo"), genero: campos.get("genero").trim(), ano: Number(campos.get("ano")), status: campos.get("status"), avaliacao: avaliacao ? Number(avaliacao) : null, favorito: campos.has("favorito"), observacoes: (campos.get("observacoes") || "").trim() };
}
function validarObra(obra, form) {
  if (!obra.titulo || !obra.genero || !obra.tipo || !obra.status || !Number.isInteger(obra.ano) || obra.ano < 1888 || obra.ano > 2100 || (obra.avaliacao !== null && (!Number.isInteger(obra.avaliacao) || obra.avaliacao < 1 || obra.avaliacao > 5))) {
    form.reportValidity();
    return false;
  }
  return true;
}
function atualizarObra(id, atualizada) {
  const obras = carregarObras();
  const posicao = obras.findIndex((obra) => obra.id === id);
  if (posicao < 0) return false;
  obras[posicao] = atualizada;
  return salvarObras(obras);
}
function iniciarFormulario(id, modo) {
  const form = document.querySelector(id);
  if (!form) return;
  const chaveId = new URLSearchParams(location.search).get("id");
  let obra = modo === "editar" ? carregarObras().find((item) => item.id === chaveId) : null;
  if (modo === "editar" && !obra) {
    document.querySelector("main").replaceChildren(el("h1", "Obra não encontrada"), el("p", "Volte à coleção e selecione uma obra cadastrada."));
    return;
  }
  if (obra) {
    for (const [nome, valor] of Object.entries(obra)) {
      const campo = form.elements.namedItem(nome);
      if (!campo) continue;
      if (nome === "favorito") campo.checked = Boolean(valor);
      else campo.value = valor ?? "";
    }
    const titulo = document.querySelector("#titulo-pagina");
    if (titulo) titulo.textContent = `Editar ${obra.titulo}`;
  }
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = obterFormulario(obra || { id: gerarId(form.elements.titulo.value) }, id);
    if (!validarObra(dados, form)) return;
    const ok = modo === "editar" ? atualizarObra(obra.id, dados) : salvarObras([...carregarObras(), dados]);
    if (!ok) { anunciar("Não foi possível salvar. Verifique o espaço disponível no navegador."); return; }
    salvarMensagem(`“${dados.titulo}” ${modo === "editar" ? "foi atualizada" : "foi cadastrada"} na coleção.`);
    location.href = "../index.html";
  });
}
function criarAcoes(obra) {
  const acoes = el("div", undefined, "table-actions");
  const link = (rotulo, arquivo) => { const a = el("a", rotulo); a.href = `pages/${arquivo}.html?id=${encodeURIComponent(obra.id)}`; a.setAttribute("aria-label", `${rotulo} ${obra.titulo}`); return a; };
  acoes.append(link("Detalhes", "detalhes"), link("Editar", "editar"));
  const excluir = el("button", "Excluir", "button-danger"); excluir.type = "button"; excluir.dataset.excluir = obra.id; excluir.setAttribute("aria-label", `Excluir ${obra.titulo}`); acoes.append(excluir);
  const td = document.createElement("td"); td.append(acoes); return td;
}
function criarLinha(obra) {
  const tr = document.createElement("tr");
  const th = el("th", obra.titulo); th.scope = "row";
  const estado = STATUS[obra.status] || STATUS["quero-assistir"];
  const statusTd = document.createElement("td"); statusTd.append(el("span", estado.rotulo, `status ${estado.classe}`));
  const nota = document.createElement("td");
  if (obra.avaliacao) { const estrelas = el("span", "★".repeat(obra.avaliacao) + "☆".repeat(5 - obra.avaliacao)); estrelas.setAttribute("aria-hidden", "true"); nota.append(estrelas, el("span", `${obra.avaliacao} de 5 estrelas`, "visually-hidden"), " ", el("span", `(${obra.avaliacao}/5)`, "rating-text")); }
  else nota.textContent = "Não avaliado";
  tr.append(th, el("td", TIPOS[obra.tipo] || obra.tipo), el("td", obra.genero), el("td", String(obra.ano)), statusTd, nota, el("td", obra.favorito ? "Sim" : "Não"), criarAcoes(obra));
  return tr;
}
function iniciarColecao() {
  const corpo = document.querySelector("#lista-obras");
  let mensagem = sessionStorage.getItem(CHAVE_MENSAGEM);
  if (mensagem) { anunciar(mensagem); sessionStorage.removeItem(CHAVE_MENSAGEM); }
  const pesquisar = document.querySelector("#pesquisa");
  const tipo = document.querySelector("#filtro-tipo");
  const genero = document.querySelector("#filtro-genero");
  const status = document.querySelector("#filtro-status");
  const favorito = document.querySelector("#filtro-favorito");
  const ordem = document.querySelector("#ordenacao");
  function renderizar() {
    const termo = (pesquisar?.value || "").trim().toLocaleLowerCase("pt-BR");
    const chaveGenero = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const filtros = carregarObras().filter((obra) => (!termo || obra.titulo.toLocaleLowerCase("pt-BR").includes(termo)) && (!tipo || tipo.value === "todos" || obra.tipo === tipo.value) && (!genero || genero.value === "todos" || chaveGenero(obra.genero) === genero.value) && (!status || status.value === "todos" || obra.status === status.value) && (!favorito || favorito.value === "todos" || String(obra.favorito) === String(favorito.value === "sim")));
    const comparadores = { "titulo-az": (a,b) => a.titulo.localeCompare(b.titulo, "pt-BR"), "titulo-za": (a,b) => b.titulo.localeCompare(a.titulo, "pt-BR"), "ano-recente": (a,b) => b.ano-a.ano, "ano-antigo": (a,b) => a.ano-b.ano, "avaliacao-maior": (a,b) => (b.avaliacao || 0)-(a.avaliacao || 0), "avaliacao-menor": (a,b) => (a.avaliacao || 0)-(b.avaliacao || 0) };
    filtros.sort(comparadores[ordem?.value] || comparadores["titulo-az"]);
    const linhas = filtros.map(criarLinha);
    if (!linhas.length) { const tr = document.createElement("tr"); const td = el("td", "Nenhuma obra encontrada com esses critérios."); td.colSpan = 8; tr.append(td); linhas.push(tr); }
    corpo.replaceChildren(...linhas);
    document.querySelector("#contador-obras").textContent = `${filtros.length} ${filtros.length === 1 ? "obra" : "obras"}`;
  }
  [pesquisar, tipo, genero, status, favorito, ordem].filter(Boolean).forEach((campo) => campo.addEventListener("input", renderizar));
  document.querySelector("#aplicar-filtros")?.addEventListener("click", renderizar);
  document.querySelector(".filter-form")?.addEventListener("reset", () => setTimeout(renderizar));
  document.querySelector(".search-form")?.addEventListener("submit", (e) => { e.preventDefault(); renderizar(); });
  corpo.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-excluir]"); if (!botao) return;
    const obras = carregarObras(); const obra = obras.find((item) => item.id === botao.dataset.excluir);
    if (!obra || !confirm(`Excluir “${obra.titulo}” da coleção?`)) return;
    if (salvarObras(obras.filter((item) => item.id !== obra.id))) { renderizar(); anunciar(`“${obra.titulo}” foi excluída da coleção.`); }
  });
  renderizar();
}
function iniciarDetalhes() {
  const obra = carregarObras().find((item) => item.id === new URLSearchParams(location.search).get("id"));
  const main = document.querySelector("main");
  if (!obra) { main.replaceChildren(el("h1", "Obra não encontrada"), el("a", "Voltar à coleção")); main.querySelector("a").href = "../index.html"; return; }
  document.querySelector("#titulo-pagina").textContent = obra.titulo;
  const dl = document.querySelector(".details-list");
  const campos = [["Tipo", TIPOS[obra.tipo]], ["Gênero", obra.genero], ["Ano de lançamento", String(obra.ano)], ["Status", STATUS[obra.status]?.rotulo], ["Avaliação", obra.avaliacao ? `${obra.avaliacao} de 5 estrelas` : "Não avaliado"], ["Favorito", obra.favorito ? "Sim" : "Não"], ["Observações", obra.observacoes || "Nenhuma"]];
  dl.replaceChildren(...campos.map(([chave, valor]) => { const div = document.createElement("div"); if (chave === "Observações") div.className = "details-wide"; div.append(el("dt", chave), el("dd", valor)); return div; }));
  const editar = document.querySelector("[data-editar-obra]"); if (editar) editar.href = `editar.html?id=${encodeURIComponent(obra.id)}`;
  const excluir = document.querySelector("[data-excluir-detalhes]"); if (excluir) excluir.addEventListener("click", () => { if (confirm(`Excluir “${obra.titulo}” da coleção?`)) { salvarObras(carregarObras().filter((item) => item.id !== obra.id)); location.href = "../index.html"; } });
}
function iniciarBuscaApi() {
  const form = document.querySelector("#form-busca-api"); if (!form) return;
  const resultados = document.querySelector("#resultados-api");
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault(); const query = form.elements.busca.value.trim();
    if (query.length < 2) { resultados.textContent = "Digite pelo menos dois caracteres para buscar."; return; }
    resultados.textContent = "Buscando no TVmaze…";
    try {
      const resposta = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      if (!resposta.ok) throw new Error("Falha na resposta da API");
      const dados = await resposta.json(); resultados.replaceChildren();
      if (!dados.length) { resultados.textContent = "Nenhuma série encontrada. Você ainda pode preencher o formulário manualmente."; return; }
      dados.slice(0, 5).forEach(({ show }) => {
        const item = document.createElement("article"); item.className = "api-result";
        const titulo = el("h3", show.name); const meta = el("p", `${(show.genres || []).join(", ") || "Gênero não informado"} · ${(show.premiered || "").slice(0,4) || "Ano não informado"}`);
        const resumo = el("p", (show.summary || "").replace(/<[^>]*>/g, "").slice(0, 220) || "Sem sinopse disponível.");
        const escolher = el("button", "Usar estes dados"); escolher.type = "button"; escolher.addEventListener("click", () => {
          const f = document.querySelector("#form-cadastro"); f.elements.titulo.value = show.name; f.elements.tipo.value = "serie"; f.elements.genero.value = show.genres?.[0] || "Drama";
          const ano = Number((show.premiered || "").slice(0,4)); f.elements.ano.value = ano >= 1888 ? ano : new Date().getFullYear(); f.elements.status.value = "quero-assistir";
          f.elements.titulo.focus(); document.querySelector("#feedback-api").textContent = `Dados de “${show.name}” preenchidos. Revise os campos e conclua o cadastro.`;
        });
        item.append(titulo, meta, resumo, escolher); resultados.append(item);
      });
    } catch (erro) { resultados.textContent = "Não foi possível acessar o TVmaze. Você pode preencher o cadastro manualmente."; console.error(erro); }
  });
}

if (document.querySelector("#lista-obras")) iniciarColecao();
if (document.querySelector("#form-cadastro")) { iniciarFormulario("#form-cadastro", "cadastro"); iniciarBuscaApi(); }
if (document.querySelector("#form-edicao")) iniciarFormulario("#form-edicao", "editar");
if (document.querySelector(".details-card")) iniciarDetalhes();
