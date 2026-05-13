// ============================================================
// setup.ts — Criação das tabelas no banco de dados
// ============================================================
// Este arquivo define o schema relacional da loja.
//
// Relacionamentos:
//   orders.customer_id  →  customers.id   (quem comprou)
//   orders.product_id   →  products.id    (o que foi comprado)
//
// FOREIGN KEY garante integridade referencial:
//   não é possível criar um pedido com um cliente inexistente.
// ============================================================

import { pool } from "./db";

export async function setupTables(): Promise<void> {
  // Uma única string SQL com múltiplos comandos executados em sequência
  const sql = `
    -- Tabela de clientes
    -- Armazena quem pode realizar pedidos na loja
    CREATE TABLE IF NOT EXISTS customers (
      id    SERIAL        PRIMARY KEY,  -- identificador único, autoincremento
      name  VARCHAR(100)  NOT NULL,     -- nome obrigatório
      email VARCHAR(150)  NOT NULL      -- email obrigatório
    );

    -- Tabela de produtos
    -- Catálogo de itens disponíveis para venda
    CREATE TABLE IF NOT EXISTS products (
      id    SERIAL          PRIMARY KEY,
      name  VARCHAR(100)    NOT NULL,
      price NUMERIC(10, 2)  NOT NULL    -- preço com 2 casas decimais
    );

    -- Tabela de pedidos
    -- Representa cada compra realizada: quem comprou, o quê e quanto
    CREATE TABLE IF NOT EXISTS orders (
      id          SERIAL    PRIMARY KEY,
      customer_id INTEGER   NOT NULL REFERENCES customers(id),  -- FK → customers
      product_id  INTEGER   NOT NULL REFERENCES products(id),   -- FK → products
      quantity    INTEGER   NOT NULL,
      created_at  TIMESTAMP NOT NULL DEFAULT NOW()              -- data/hora automática
    );
  `;

  await pool.query(sql);
  console.log("  Tabelas criadas (ou ja existentes): customers, products, orders");
}
