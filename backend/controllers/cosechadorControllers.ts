import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getCosechadores = async (ctx: Context) => {
  try {
    const result = await client.queryObject(`
      SELECT c.id, c.rut, c.nombre, c.p_apellido, c.s_apellido, c.id_cuadrilla, cu.nombre as cuadrilla_nombre
      FROM cosechador c
      LEFT JOIN cuadrilla cu ON c.id_cuadrilla = cu.id
    `);
    ctx.response.body = result.rows;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al obtener cosechadores", error: error.message };
  }
};

export const createCosechador = async (ctx: Context) => {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Body vacío" };
      return;
    }

    const body = await ctx.request.body.json();
    const { rut, nombre, p_apellido, s_apellido, id_cuadrilla } = body;

    if (!rut || !nombre || !p_apellido) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Faltan campos obligatorios: rut, nombre, p_apellido" };
      return;
    }

    // Validate RUT uniqueness
    const rutCheck = await client.queryObject<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM cosechador WHERE rut = $1)`,
      [rut]
    );
    if (rutCheck.rows[0].exists) {
      ctx.response.status = 400;
      ctx.response.body = { message: "RUT ya registrado" };
      return;
    }

    // Validate cuadrilla exists if provided
    if (id_cuadrilla) {
      const cuadrillaCheck = await client.queryObject<{ exists: boolean }>(
        `SELECT EXISTS (SELECT 1 FROM cuadrilla WHERE id = $1)`,
        [id_cuadrilla]
      );
      if (!cuadrillaCheck.rows[0].exists) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Cuadrilla no encontrada" };
        return;
      }
    }

    const result = await client.queryObject<{ id: number }>(
      `INSERT INTO cosechador (rut, nombre, p_apellido, s_apellido, id_cuadrilla)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [rut, nombre, p_apellido, s_apellido, id_cuadrilla || null]
    );

    ctx.response.status = 201;
    ctx.response.body = { id: result.rows[0].id, message: "Cosechador creado exitosamente" };
  } catch (error) {
    console.error("Error al crear cosechador:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al crear cosechador", error: error.message };
  }
};

export const updateCosechador = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    const body = await ctx.request.body.json();
    const { rut, nombre, p_apellido, s_apellido, id_cuadrilla } = body;

    if (!rut || !nombre || !p_apellido) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Faltan campos obligatorios: rut, nombre, p_apellido" };
      return;
    }

    // Validate RUT uniqueness (excluding current cosechador)
    const rutCheck = await client.queryObject<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM cosechador WHERE rut = $1 AND id != $2)`,
      [rut, id]
    );
    if (rutCheck.rows[0].exists) {
      ctx.response.status = 400;
      ctx.response.body = { message: "RUT ya registrado por otro cosechador" };
      return;
    }

    // Validate cuadrilla exists if provided
    if (id_cuadrilla) {
      const cuadrillaCheck = await client.queryObject<{ exists: boolean }>(
        `SELECT EXISTS (SELECT 1 FROM cuadrilla WHERE id = $1)`,
        [id_cuadrilla]
      );
      if (!cuadrillaCheck.rows[0].exists) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Cuadrilla no encontrada" };
        return;
      }
    }

    const result = await client.queryObject(
      `UPDATE cosechador
       SET rut = $1, nombre = $2, p_apellido = $3, s_apellido = $4, id_cuadrilla = $5
       WHERE id = $6
       RETURNING *`,
      [rut, nombre, p_apellido, s_apellido, id_cuadrilla || null, id]
    );

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosechador no encontrado" };
      return;
    }

    ctx.response.body = result.rows[0];
  } catch (error) {
    console.error("Error al actualizar cosechador:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al actualizar cosechador", error: error.message };
  }
};

export const deleteCosechador = async (ctx: Context) => {
  try {
    const id = ctx.params.id;

    // Check if cosechador has active harvest records
    const registros = await client.queryObject<{ exists: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM registro_cosecha WHERE id_cosechador = $1)`,
      [id]
    );
    if (registros.rows[0].exists) {
      ctx.response.status = 400;
      ctx.response.body = { message: "No se puede eliminar: cosechador tiene registros de cosecha activos" };
      return;
    }

    const result = await client.queryObject(
      `DELETE FROM cosechador WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosechador no encontrado" };
      return;
    }

    ctx.response.status = 204;
  } catch (error) {
    console.error("Error al eliminar cosechador:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al eliminar cosechador", error: error.message };
  }
};

export const getCosechadorById = async (ctx: Context) => {
  try {
    // Obtener el ID de los parámetros de la ruta
    const id = ctx.params.id;
    
    if (!id || isNaN(Number(id))) {
      ctx.response.status = 400;
      ctx.response.body = { message: "ID inválido o no proporcionado" };
      return;
    }

    const result = await client.queryObject({
      text: `
        SELECT 
          c.id, 
          c.rut, 
          c.nombre, 
          c.p_apellido, 
          c.s_apellido, 
          c.id_cuadrilla, 
          cu.nombre as cuadrilla_nombre,
          e.nombre as encargado_nombre,
          e.p_apellido as encargado_apellido
        FROM cosechador c
        LEFT JOIN cuadrilla cu ON c.id_cuadrilla = cu.id
        LEFT JOIN encargados e ON cu.id_encargado = e.id
        WHERE c.id = $1
      `,
      args: [Number(id)]
    });

    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosechador no encontrado" };
      return;
    }

    ctx.response.body = result.rows[0];
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { 
      message: "Error al obtener el cosechador", 
      error: error.message 
    };
  }
};