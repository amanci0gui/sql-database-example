// ============================================================
// seed.ts — Inserção de dados fictícios (dados de exemplo)
// ============================================================
// O seed popula o banco com dados iniciais para demonstração.
// Usamos INSERT ... ON CONFLICT DO NOTHING para que o script
// possa ser executado várias vezes sem duplicar registros.
// ============================================================

import { pool } from "./db";

export async function seedData(): Promise<void> {
  // ── Clientes ────────────────────────────────────────────────
  // Inserimos dois clientes de exemplo.
  // RETURNING id nos devolve o id gerado pelo SERIAL.
  const joao = await pool.query(
    `INSERT INTO customers (name, email)
     VALUES ('Joao Silva', 'joao@email.com')
     ON CONFLICT DO NOTHING
     RETURNING id`
  );

  const maria = await pool.query(
    `INSERT INTO customers (name, email)
     VALUES ('Maria Souza', 'maria@email.com')
     ON CONFLICT DO NOTHING
     RETURNING id`
  );

  // ── Produtos ────────────────────────────────────────────────
  const mouse = await pool.query(
    `INSERT INTO products (name, price)
     VALUES ('Mouse', 100.00)
     ON CONFLICT DO NOTHING
     RETURNING id`
  );

  await pool.query(
    `INSERT INTO products (name, price)
     VALUES ('Teclado', 200.00)
     ON CONFLICT DO NOTHING`
  );

  const monitor = await pool.query(
    `INSERT INTO products (name, price)
     VALUES ('Monitor', 500.00)
     ON CONFLICT DO NOTHING
     RETURNING id`
  );

  // ── Pedidos ─────────────────────────────────────────────────
  // Só inserimos pedidos se os clientes/produtos foram criados agora
  // (evita duplicatas em re-execuções do script)
  if (joao.rows.length > 0 && mouse.rows.length > 0) {
    const joaoId  = joao.rows[0].id;
    const mouseId = mouse.rows[0].id;

    // João comprou 2 mouses
    await pool.query(
      `INSERT INTO orders (customer_id, product_id, quantity)
       VALUES ($1, $2, 2)`,
      [joaoId, mouseId]
    );
  }

  if (maria.rows.length > 0 && monitor.rows.length > 0) {
    const mariaId   = maria.rows[0].id;
    const monitorId = monitor.rows[0].id;

    // Maria comprou 1 monitor
    await pool.query(
      `INSERT INTO orders (customer_id, product_id, quantity)
       VALUES ($1, $2, 1)`,
      [mariaId, monitorId]
    );
  }

  console.log("  Dados inseridos: 2 clientes, 3 produtos, 2 pedidos");
}
