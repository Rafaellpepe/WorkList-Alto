import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from './db.js';

test('banco cria as tabelas e bloqueia dois lançamentos ativos do mesmo pedido', () => {
  const db = openDb(':memory:');
  db.prepare(`INSERT INTO arquivos (nome_original, tipo, hash_sha256) VALUES ('a.xls','xls','x')`).run();
  db.prepare(`INSERT INTO pedidos (arquivo_id, cnpj_original, cnpj, impressao_digital) VALUES (1,'1','1','f')`).run();
  db.prepare(`INSERT INTO lancamentos (pedido_id, situacao) VALUES (1,'confirmado')`).run();
  assert.throws(() => db.prepare(`INSERT INTO lancamentos (pedido_id, situacao) VALUES (1,'em_andamento')`).run());
  // Uma tentativa com erro não bloqueia nova tentativa.
  db.prepare(`INSERT INTO lancamentos (pedido_id, situacao) VALUES (1,'erro')`).run();
});
