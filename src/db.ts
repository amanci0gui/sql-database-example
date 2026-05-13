// ============================================================
// db.ts — Conexão com o banco de dados PostgreSQL
// ============================================================
// O módulo "pg" fornece um Pool de conexões.
// Um Pool reutiliza conexões abertas, evitando overhead de
// abrir/fechar uma nova conexão a cada query.
// ============================================================

import { Pool } from "pg";
import dotenv from "dotenv";

// Carrega as variáveis definidas no arquivo .env
dotenv.config();

// Cria o pool de conexões com as credenciais do banco
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "store_db",
});
