import express from 'express';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { openDb } from './db.js';

const db = openDb();
const app = express();
app.use(express.json());

app.get('/api/saude', (_req, res) => {
  res.json({
    ok: true,
    cerberoConfigurado: Boolean(process.env.CERBERO_URL && process.env.CERBERO_USUARIO && process.env.CERBERO_SENHA),
  });
});

app.get('/api/dashboard', (_req, res) => {
  const contar = (where: string) =>
    (db.prepare(`SELECT COUNT(*) AS n FROM pedidos ${where}`).get() as { n: number }).n;
  res.json({
    importados: contar(''),
    aguardandoLancamento: contar(`WHERE status IN ('aguardando_conferencia','aguardando_autorizacao')`),
    lancados: contar(`WHERE status = 'lancado'`),
    comErro: contar(`WHERE status IN ('erro_lancamento','cliente_nao_encontrado','produto_nao_encontrado')`),
    processadosHoje: (db
      .prepare(`SELECT COUNT(*) AS n FROM lancamentos WHERE date(iniciado_em) = date('now','localtime')`)
      .get() as { n: number }).n,
  });
});

// Em produção o servidor também entrega a tela já compilada.
const webDist = resolve(import.meta.dirname, '../../web/dist');
if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(resolve(webDist, 'index.html')));
}

const port = Number(process.env.PORT ?? 3333);
// Só escuta no próprio computador: ninguém da rede acessa o sistema.
app.listen(port, '127.0.0.1', () => {
  console.log(`WorkList Alto rodando em http://localhost:${port}`);
});
