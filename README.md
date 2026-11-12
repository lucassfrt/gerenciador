# Gerenciador de Filmes e Séries

Aplicação web para organizar uma coleção pessoal de filmes e séries. Os registros são mantidos no `localStorage` do navegador.

## Funcionalidades

- Cadastro com validação, feedback e persistência local.
- Listagem dinâmica, detalhes, edição e exclusão.
- Pesquisa por título, filtros por tipo, gênero, status e favorito, além de ordenação por título, ano e avaliação.
- Busca de séries na [API pública do TVmaze](https://www.tvmaze.com/api): os resultados podem preencher o formulário e ser adicionados à coleção local.

## Executar

Abra `index.html` em um navegador ou sirva a pasta por HTTP. A busca da API depende de conexão com a internet. Os dados da coleção ficam no navegador usado e não são sincronizados entre dispositivos.

## Estrutura

- `index.html`: listagem e controles da coleção.
- `pages/cadastro.html`: cadastro e busca no TVmaze.
- `pages/detalhes.html`: ficha de uma obra selecionada.
- `pages/editar.html`: edição de uma obra selecionada.
- `assets/js/script.js`: operações, filtros, renderização e persistência.
- `assets/css/style.css`: estilos responsivos.

## Publicação

O repositório está preparado para publicação pela raiz da branch `main` no GitHub Pages.

- Repositório: <https://github.com/lucassfrt/gerenciador>
- GitHub Pages: <https://lucassfrt.github.io/gerenciador/>
