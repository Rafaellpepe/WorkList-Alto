import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DB_PATH = resolve(process.env.DB_PATH ?? resolve(import.meta.dirname, '../../data/worklist.db'));

/**
 * Esquema inicial.
 * - pedidos.impressao_digital identifica o pedido para bloquear lançamento em dobro.
 * - lancamentos guarda cada tentativa no Cerbero; o índice único parcial impede
 *   duas tentativas "abertas" ou "confirmadas" para o mesmo pedido.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS arquivos (
  id            INTEGER PRIMARY KEY,
  nome_original TEXT NOT NULL,
  tipo          TEXT NOT NULL,              -- xls, xlsx, csv, pdf
  hash_sha256   TEXT NOT NULL,
  importado_em  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS pedidos (
  id                INTEGER PRIMARY KEY,
  arquivo_id        INTEGER NOT NULL REFERENCES arquivos(id),
  numero_origem     TEXT,                   -- número do pedido no arquivo, quando existe
  cnpj_original     TEXT NOT NULL,          -- como veio no arquivo, para exibição
  cnpj              TEXT NOT NULL,          -- só dígitos, para comparação
  razao_social      TEXT,
  data_emissao      TEXT,
  data_entrega      TEXT,
  valor_total       REAL,
  impressao_digital TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'aguardando_conferencia',
  numero_cerbero    TEXT,
  criado_em         TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
CREATE INDEX IF NOT EXISTS idx_pedidos_impressao ON pedidos(impressao_digital);

CREATE TABLE IF NOT EXISTS itens (
  id              INTEGER PRIMARY KEY,
  pedido_id       INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  ordem           INTEGER NOT NULL,
  ean             TEXT,
  codigo          TEXT,
  descricao       TEXT,
  unidade         TEXT,
  quantidade      REAL,
  valor_unitario  REAL,
  valor_total     REAL,
  pendencia       TEXT                      -- motivo quando algo não foi reconhecido
);

CREATE TABLE IF NOT EXISTS lancamentos (
  id              INTEGER PRIMARY KEY,
  pedido_id       INTEGER NOT NULL REFERENCES pedidos(id),
  situacao        TEXT NOT NULL,            -- em_andamento, confirmado, em_duvida, erro, cancelado
  numero_cerbero  TEXT,
  iniciado_em     TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  finalizado_em   TEXT,
  erro            TEXT,
  screenshot      TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_lancamento_ativo
  ON lancamentos(pedido_id) WHERE situacao IN ('em_andamento','confirmado','em_duvida');

CREATE TABLE IF NOT EXISTS eventos (
  id         INTEGER PRIMARY KEY,
  pedido_id  INTEGER REFERENCES pedidos(id),
  nivel      TEXT NOT NULL,                 -- info, aviso, erro
  mensagem   TEXT NOT NULL,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
`;

export function openDb(path = DB_PATH): DatabaseSync {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  return db;
}
