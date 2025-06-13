import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getEncargados = async (ctx) => {
  const result = await client.queryObject("SELECT * FROM encargados");
  ctx.response.body = result.rows;
};

export const createEncargado = async (ctx: Context) => {
  try {
    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();

      const { nombre, p_apellido, email, telefono, rut, password, empresa, region } = body;

      if (!nombre || !p_apellido || !email || !password || !rut) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject<{ id: number }>(
        `INSERT INTO encargados (nombre, p_apellido, email, telefono, rut, password, empresa, region)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;`,
        [nombre, p_apellido, email, telefono, rut, password, empresa, region]
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

export const updateEncargado = async (ctx) => {
  try {
    const id = ctx.params.id;
    const body = await ctx.request.body.json();

    const {
      nombre,
      p_apellido,
      email,
      telefono,
      rut,
      empresa,
      region
    } = body;

    // Puedes agregar validaciones aquí

    const result = await client.queryObject`
      UPDATE encargados
      SET nombre = ${nombre},
          p_apellido = ${p_apellido},
          email = ${email},
          telefono = ${telefono},
          rut = ${rut},
          empresa = ${empresa},
          region = ${region}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Encargado no encontrado" };
      return;
    }

    ctx.response.body = result.rows[0];
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al actualizar encargado" };
  }
};

export const deleteEncargado = async (ctx) => {
  try {
    const id = ctx.params.id;

    // 1. Buscar cuadrillas a cargo de este encargado
    const cuadrillas = await client.queryObject<{ id: number }>`
      SELECT id FROM cuadrilla WHERE id_encargado = ${id};
    `;

    if (cuadrillas.rows.length > 0) {
      // 2. Buscar cosechadores activos en esas cuadrillas
      const cuadrillaIds = cuadrillas.rows.map(c => c.id);
      const cosechadores = await client.queryObject`
        SELECT * FROM cosechador WHERE id_cuadrilla = ANY(${cuadrillaIds});
      `;
      if (cosechadores.rows.length > 0) {
        ctx.response.status = 400;
        ctx.response.body = { message: "No se puede eliminar: encargado tiene cosechadores activos asignados." };
        return;
      }
    }

    // 3. Eliminar el encargado
    const result = await client.queryObject`
      DELETE FROM encargados
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Encargado no encontrado" };
      return;
    }

    ctx.response.status = 204; // No content
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al eliminar encargado" };
  }
};