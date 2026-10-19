# Gerenciador de Filmes e Séries

Estrutura HTML acadêmica para organizar, controlar e acompanhar uma coleção pessoal de filmes e séries. A entidade principal do sistema é **Filme/Série**.

## Etapa 2

Esta versão aplica a folha de estilos em `assets/css/style.css` e adiciona `assets/js/script.js`, que torna funcionais o **cadastro** e a **exclusão** de obras:

- **Cadastrar:** o formulário de `pages/cadastro.html` valida os campos obrigatórios, salva a obra e volta para a coleção com uma mensagem de confirmação;
- **Excluir:** o botão **Excluir** de cada linha pede confirmação e remove a obra da tabela;
- **Persistência:** a coleção é guardada no `localStorage` do navegador, então as alterações continuam após recarregar a página. Na primeira visita são exibidas as seis obras de exemplo.

Pesquisa, filtros, ordenação e edição continuam representados apenas na interface e serão implementados em uma etapa posterior. Não há banco de dados, API ou autenticação.

### Etapa 1

A Etapa 1 (release `v1.0.0`) contém somente a estrutura HTML semântica e acessível, com os seis registros escritos diretamente no HTML.

## Dados de uma obra

Cada obra pode conter:

- título;
- tipo: Filme ou Série;
- gênero;
- ano de lançamento;
- status de acompanhamento;
- avaliação pessoal opcional, de 1 a 5 estrelas;
- indicação de favorito;
- observações opcionais.

Os status disponíveis são:

- **Quero Assistir:** obra planejada para o futuro;
- **Assistindo:** obra em acompanhamento;
- **Concluído:** obra finalizada;
- **Abandonado:** acompanhamento interrompido.

Uma avaliação vazia significa que a obra ainda não foi avaliada.

## Estrutura de arquivos

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── pages/
│   ├── cadastro.html
│   ├── detalhes.html
│   └── editar.html
└── README.md
```

Todas as páginas usam `assets/css/style.css`. O script é carregado em `index.html` e `pages/cadastro.html`.

## Como abrir localmente

Não é necessário instalar dependências ou executar ferramentas de build.

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` em um navegador moderno.

Também é possível servir a pasta com qualquer servidor HTTP estático de sua preferência. Todos os caminhos de navegação são relativos e funcionam tanto localmente quanto sob o caminho de um projeto no GitHub Pages.

## Páginas e navegação

- `index.html`: coleção com exclusão de obras, além de pesquisa, filtros e ordenação previstos;
- `pages/cadastro.html`: formulário de cadastro de obras;
- `pages/detalhes.html`: ficha demonstrativa de **Duna: Parte Dois**;
- `pages/editar.html`: formulário de edição preenchido para a mesma obra.

O menu principal permite alternar entre a coleção e o cadastro. Na linha de **Duna: Parte Dois**, os links levam aos detalhes e à edição correspondentes. Nas outras obras, esses controles aparecem desabilitados para não sugerir fichas inexistentes.

## Publicação no GitHub Pages

O projeto foi preparado para publicação pela raiz da branch principal:

1. No repositório do GitHub, acesse **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch `main`, a pasta `/(root)` e salve.

Repositório: <https://github.com/lucassfrt/gerenciador-filmes>

Aplicação publicada: <https://lucassfrt.github.io/gerenciador-filmes/>
"# gerenciador" 
"# gerenciador" 
