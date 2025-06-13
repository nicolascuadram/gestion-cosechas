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

export const login = async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const { email, password } = body;
    console.log("Login attempt with:", email, password  );
    if (!email || !password) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Email y contraseña requeridos" };
      return;
    }
    const result = await client.queryObject(
      "SELECT * FROM encargados WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length === 0) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Credenciales inválidas" };
      return;
    }
    // Aquí podrías generar un JWT, pero para empezar puedes devolver los datos del usuario
    ctx.response.body = { user: result.rows[0], tipo: "encargado" };
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error en login" };
  }
};