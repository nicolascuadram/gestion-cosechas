import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getTipo_cosecha = async (ctx) => {
  const result = await client.queryObject("SELECT * FROM tipo_cosecha");
  ctx.response.body = result.rows;
};


export const createTipo_cosecha = async (ctx: Context) => {
  try {
    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();

      const { nombre, descripcion, precio_por_capacho} = body;

      if (!nombre || !descripcion || !precio_por_capacho) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject<{ id: number }>(
        `INSERT INTO tipo_cosecha (nombre, descripcion, precio_por_capacho)
        VALUES ($1, $2, $3)
        RETURNING id;`,
        [nombre, descripcion, precio_por_capacho]
      );

      ctx.response.status = 201;
      ctx.response.body = { id: result.rows[0].id, message: "Encargado creado exitosamente" };
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Tipo de body no soportado o body vacío" };
    }
  } catch (error) {
    console.error("Error al crear encargado:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al crear encargado", error: error.message };
  }
};


