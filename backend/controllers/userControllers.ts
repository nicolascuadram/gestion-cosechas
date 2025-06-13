import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getUsers = async (ctx: Context) => {
  try {
    const result = await client.queryObject("SELECT id, name FROM users;");
    ctx.response.status = 200;
    ctx.response.body = result.rows;
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al obtener usuarios" };
  }
};

