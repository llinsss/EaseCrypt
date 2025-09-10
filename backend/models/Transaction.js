import db from "../config/database.js";

const Transaction = {
  async findLatestByEmail(email) {
    return await db("transactions")
      .where({ email })
      .orderBy("id", "desc")
      .first();
  },

  async findRecentByEmail(email) {
    return await db("transactions")
      .where({ email })
      .limit(5)
      .orderBy("id", "desc");
  },

  async findAllByEmail(email) {
    return await db("transactions").where({ email }).orderBy("id", "desc");
  },

  async find(id) {
    return await db("transactions").where({ id }).first();
  },

  async findByReference(reference) {
    return await db("transactions").where({ reference }).first();
  },

  async findByHash(hash) {
    return await db("transactions").where({ hash }).first();
  },

  async findByAccountNumber(account_number) {
    return await db("transactions").where({ account_number }).first();
  },

  async findById(id) {
    return await db("transactions").where({ id }).first();
  },

  async create(trxData) {
    const [id] = await db("transactions").insert(trxData);
    return this.findById(id);
  },

  async update(id, trxData) {
    await db("transactions")
      .where({ id })
      .update({
        ...trxData,
        updated_at: db.fn.now(),
      });

    return this.findById(id);
  },

  async delete(id) {
    return await db("transactions").where({ id }).del();
  },
};

export default Transaction;
