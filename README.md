# WorkList Alto

Sistema local para importar pedidos (Excel e PDF), conferir os dados e lançá-los no Cerbero CCA com automação de navegador. Nenhum pedido é confirmado no Cerbero sem autorização do usuário.

## Requisitos

- Windows 10/11
- Node.js 22.13 ou mais novo ([nodejs.org](https://nodejs.org), versão LTS)

## Primeira instalação

1. Copie `.env.example` para `.env` e preencha endereço, usuário e senha do Cerbero. O `.env` nunca vai para o Git.
2. Dê dois cliques em `iniciar.bat`. Na primeira vez ele instala as dependências e monta a tela.
3. Abra http://localhost:3333 no navegador.

## Desenvolvimento

```
npm install
npm run dev        # servidor em :3333 e tela em :5173
npm test           # testes do servidor
npm run typecheck
```

## Estrutura

- `server/` Node.js + TypeScript: API, banco SQLite (`data/worklist.db`), leitores de arquivos e automação Playwright.
- `web/` React + TypeScript: painel com Dashboard, Importar, Conferir, Automatizar, Histórico e Configurações.

Arquivos de pedidos reais ficam fora do Git (pasta `amostras/`, ignorada).
