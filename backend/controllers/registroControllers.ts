import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getRegistros = async (ctx: Context) => {
  const result = await client.queryObject("SELECT * FROM registro_cosecha");
  ctx.response.body = result.rows;
};

export const postRegistro = async (ctx: Context) => {
  try {
    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();

      const { id_cosecha, id_cosechador, fecha, cantidad_capachos } = body;

      if (!id_cosecha || !id_cosechador || !fecha || !cantidad_capachos) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject<{ id: number }>(
        `INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`,
        [id_cosecha, id_cosechador, fecha, cantidad_capachos],
      );

      ctx.response.status = 201;
      ctx.response.body = {
        id: result.rows[0].id,
        message: "Registro creado exitosamente",
      };
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Tipo de body no soportado o body vacío" };
    }
  } catch (error) {
    console.error("Error al crear registro:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error al crear registro",
      error: error.message,
    };
  }
};
