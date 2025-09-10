export const up = async (knex) => {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.string("token", 100);
    table.string("address", 100);
    table.string("email", 100);
    table.string("usd_value", 100);
    table.string("ngn_value", 100);
    table.string("crypto_value", 100);
    table.string("amount", 100);
    table.string("reference", 100);
    table.string("hash", 100);
    table.string("fee", 100);
    table.string("account_reference", 120);
    table.string("bank_name", 160);
    table.string("account_name", 120);
    table.string("account_number", 20);
    table.string("status", 100);
    table.text("remarks");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable("transactions");
};
