// ============================================================
// index.ts — Ponto de entrada da aplicação
// ============================================================
// Orquestra toda a execução em ordem:
//   1. Conecta ao banco
//   2. Cria as tabelas (schema)
//   3. Insere dados de exemplo (seed)
//   4. Executa as queries de demonstração
// ============================================================

import { pool }              from "./db";
import { setupTables }       from "./setup";
import { seedData }          from "./seed";
import { listProducts, listOrdersWithJoin, totalPerCustomer } from "./queries";

async function main(): Promise<void> {
  console.log("=".repeat(55));
  console.log("  Demo: Banco de Dados Relacional — Loja");
  console.log("=".repeat(55));

  // ── Etapa 1: verificar conexão ──────────────────────────────
  console.log("\n[1] Conectando ao PostgreSQL...");
  await pool.query("SELECT 1"); // query simples só para testar a conexão
  console.log("  Conexao estabelecida com sucesso!");

  // ── Etapa 2: criar tabelas ──────────────────────────────────
  console.log("\n[2] Criando tabelas...");
  await setupTables();

  // ── Etapa 3: popular banco ──────────────────────────────────
  console.log("\n[3] Inserindo dados de exemplo (seed)...");
  await seedData();

  // ── Etapa 4: executar queries ───────────────────────────────
  console.log("\n[4] Executando consultas SQL...");

  // 4a. SELECT simples
  await listProducts();

  // 4b. SELECT com JOIN entre 3 tabelas
  await listOrdersWithJoin();

  // 4c. SELECT com SUM + GROUP BY
  await totalPerCustomer();

  // ── Finalização ─────────────────────────────────────────────
  console.log("\n" + "=".repeat(55));
  console.log("  Demonstracao concluida!");
  console.log("=".repeat(55) + "\n");

  // Fecha todas as conexões do pool antes de encerrar o processo
  await pool.end();
}

// Executa e captura erros não tratados
main().catch((err) => {
  console.error("\nErro durante a execucao:", err.message);
  process.exit(1);
});
