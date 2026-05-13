// ============================================================
// queries.ts — Consultas SQL de demonstração
// ============================================================
// Aqui ficam as queries que serão apresentadas na aula.
// Cada função executa um SELECT diferente e exibe o resultado.
// ============================================================

import { pool } from "./db";

// ── 1. Listar todos os produtos ─────────────────────────────
// Query simples: sem JOIN, sem filtro — apenas lista o catálogo.
export async function listProducts(): Promise<void> {
  const result = await pool.query(`
    SELECT id, name, price
    FROM products
    ORDER BY price ASC
  `);

  console.log("\n  Produtos cadastrados:");
  console.log("  " + "-".repeat(40));

  for (const row of result.rows) {
    console.log(`  [${row.id}] ${row.name.padEnd(12)} R$ ${Number(row.price).toFixed(2)}`);
  }
}

// ── 2. Pedidos com JOIN entre 3 tabelas ─────────────────────
// JOIN une linhas de tabelas diferentes por meio das chaves.
//
//   orders.customer_id = customers.id  →  traz o nome do cliente
//   orders.product_id  = products.id   →  traz o nome e preço do produto
//
// Sem JOIN teríamos apenas IDs numéricos — sem contexto.
export async function listOrdersWithJoin(): Promise<void> {
  const result = await pool.query(`
    SELECT
      customers.name   AS cliente,   -- nome do cliente (de customers)
      products.name    AS produto,   -- nome do produto (de products)
      orders.quantity  AS qtd,       -- quantidade (de orders)
      products.price   AS preco_unitario
    FROM orders
      -- INNER JOIN: só retorna linhas que existem nas duas tabelas
      INNER JOIN customers ON orders.customer_id = customers.id
      INNER JOIN products  ON orders.product_id  = products.id
    ORDER BY orders.id ASC
  `);

  console.log("\n  Pedidos realizados (com JOIN):");
  console.log("  " + "-".repeat(55));
  console.log("  Cliente         Produto      Qtd   Preco Unit.");
  console.log("  " + "-".repeat(55));

  for (const row of result.rows) {
    const linha = [
      row.cliente.padEnd(16),
      row.produto.padEnd(12),
      String(row.qtd).padEnd(6),
      `R$ ${Number(row.preco_unitario).toFixed(2)}`,
    ].join("  ");

    console.log("  " + linha);
  }
}

// ── 3. Total gasto por cliente ───────────────────────────────
// SUM agrega valores numéricos.
// GROUP BY agrupa as linhas pelo cliente antes de somar.
//
// Fórmula: quantidade × preço = total por pedido
// Somamos todos os pedidos de cada cliente.
export async function totalPerCustomer(): Promise<void> {
  const result = await pool.query(`
    SELECT
      customers.name                          AS cliente,
      SUM(orders.quantity * products.price)   AS total_gasto
    FROM orders
      INNER JOIN customers ON orders.customer_id = customers.id
      INNER JOIN products  ON orders.product_id  = products.id
    GROUP BY customers.name        -- agrupa um resultado por cliente
    ORDER BY total_gasto DESC      -- ordena do maior para o menor gasto
  `);

  console.log("\n  Total gasto por cliente:");
  console.log("  " + "-".repeat(35));

  for (const row of result.rows) {
    console.log(`  ${row.cliente.padEnd(16)}  R$ ${Number(row.total_gasto).toFixed(2)}`);
  }
}
