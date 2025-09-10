export const up = async (knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 100);
    table.string("email", 100).unique();
    table.string("password", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index("email");
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable("users");
};
