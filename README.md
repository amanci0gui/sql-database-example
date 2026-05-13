# Store Demo — Banco de Dados Relacional

Projeto didático para demonstrar o uso de banco de dados relacional em um cenário de loja/e-commerce.

Utilizado na apresentação: **"O Papel dos Bancos Relacionais na Era do Big Data"**

---

## Tecnologias

| Tecnologia   | Função                                  |
|--------------|-----------------------------------------|
| Node.js      | Runtime JavaScript no servidor          |
| TypeScript   | Tipagem estática sobre JavaScript       |
| PostgreSQL   | Banco de dados relacional               |
| Docker Compose | Sobe o banco sem instalar localmente  |
| pg           | Driver oficial do PostgreSQL para Node  |
| dotenv       | Carrega variáveis de ambiente do `.env` |

---

## Estrutura do projeto

```
store-demo/
├── docker-compose.yml   # Sobe o container PostgreSQL
├── .env                 # Credenciais de conexão
├── .env.example         # Modelo do .env
├── package.json
├── tsconfig.json
└── src/
    ├── db.ts            # Conexão com o banco (Pool)
    ├── setup.ts         # Criação das tabelas (schema)
    ├── seed.ts          # Inserção de dados de exemplo
    ├── queries.ts       # Consultas SQL de demonstração
    └── index.ts         # Ponto de entrada — orquestra tudo
```

---

## Como executar

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Isso inicia um container PostgreSQL com:
- banco: `store_db`
- usuário: `admin`
- senha: `admin123`
- porta: `5432`

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar o projeto

```bash
npm run dev
```

---

## Saída esperada no terminal

```
=======================================================
  Demo: Banco de Dados Relacional — Loja
=======================================================

[1] Conectando ao PostgreSQL...
  Conexao estabelecida com sucesso!

[2] Criando tabelas...
  Tabelas criadas (ou ja existentes): customers, products, orders

[3] Inserindo dados de exemplo (seed)...
  Dados inseridos: 2 clientes, 3 produtos, 2 pedidos

[4] Executando consultas SQL...

  Produtos cadastrados:
  ----------------------------------------
  [1] Mouse        R$ 100.00
  [3] Monitor      R$ 500.00
  [2] Teclado      R$ 200.00

  Pedidos realizados (com JOIN):
  -------------------------------------------------------
  Cliente         Produto      Qtd   Preco Unit.
  -------------------------------------------------------
  Joao Silva      Mouse        2     R$ 100.00
  Maria Souza     Monitor      1     R$ 500.00

  Total gasto por cliente:
  -----------------------------------
  Maria Souza       R$ 500.00
  Joao Silva        R$ 200.00

=======================================================
  Demonstracao concluida!
=======================================================
```

---

## Schema do banco

```
customers          products
+--------+         +--------+
| id  PK |         | id  PK |
| name   |         | name   |
| email  |         | price  |
+--------+         +--------+
      \                 /
       \               /
        \             /
         +----------+
         |  orders  |
         +----------+
         | id    PK |
         | customer_id  FK → customers.id |
         | product_id   FK → products.id  |
         | quantity     |
         | created_at   |
         +----------+
```

### Integridade referencial

As **FOREIGN KEYS** garantem que:
- Não é possível criar um pedido com um `customer_id` inexistente
- Não é possível criar um pedido com um `product_id` inexistente

Isso é integridade referencial — uma das principais vantagens dos bancos relacionais.

---

## Parar o banco

```bash
docker compose down
```

Para remover também o volume (apaga os dados):

```bash
docker compose down -v
```
