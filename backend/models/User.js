import db from "../config/database.js";
import bcrypt from "bcrypt";

const User = {
  async findByEmail(email) {
    return await db("users").where({ email }).first();
  },

  async find(id) {
    return await db("users").where({ id }).first();
  },

  async findById(id) {
    return await db("users").where({ id }).first();
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [id] = await db("users").insert({
      ...userData,
      password: hashedPassword,
    });
    return this.findById(id);
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async update(id, userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await db("users")
      .where({ id })
      .update({
        ...userData,
        updated_at: db.fn.now(),
      });

    return this.findById(id);
  },

  async delete(id) {
    return await db("users").where({ id }).del();
  },
};

export default User;
