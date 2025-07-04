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

// Editar un tipo_cosecha por ID
export const updateTipo_cosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();
      const { nombre, descripcion, precio_por_capacho } = body;

      if (!nombre || !descripcion || !precio_por_capacho) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject(
        `UPDATE tipo_cosecha 
         SET nombre = $1, descripcion = $2, precio_por_capacho = $3
         WHERE id = $4`,
        [nombre, descripcion, precio_por_capacho, id]
      );

      if (result.rowCount && result.rowCount > 0) {
        ctx.response.status = 200;
        ctx.response.body = { message: "Tipo de cosecha actualizado exitosamente" };
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Tipo de cosecha no encontrado" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Body no enviado o vacío" };
    }
  } catch (error) {
    console.error("Error al actualizar tipo_cosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al actualizar tipo_cosecha", error: error.message };
  }
};

// Eliminar un tipo_cosecha por ID
export const deleteTipo_cosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `DELETE FROM tipo_cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Tipo de cosecha eliminado exitosamente" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Tipo de cosecha no encontrado" };
    }
  } catch (error) {
    console.error("Error al eliminar tipo_cosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al eliminar tipo_cosecha", error: error.message };
  }
};

export const getCosecha = async (ctx) => {
  const result = await client.queryObject("SELECT * FROM cosecha");
  ctx.response.body = result.rows;
};

export const addCosecha = async (ctx: Context) => {
  try {
    // 1. Verificar si hay cuerpo en la solicitud (igual que en tu función que funciona)
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No se recibieron datos" };
      return;
    }

    // 2. Obtener el cuerpo como JSON (usando el mismo método que en createTipo_cosecha)
    const body = await ctx.request.body.json();

    console.log("Datos recibidos:", body); // Para depuración

    // 3. Validaciones básicas (similar a tu función working)
    if (!body.id_cuadrilla || !body.id_tipo_cosecha || !body.fecha_inicio) {
      ctx.response.status = 400;
      ctx.response.body = { 
        error: "Faltan campos obligatorios",
        required: ["id_cuadrilla", "id_tipo_cosecha", "fecha_inicio"]
      };
      return;
    }

    // 4. Validar referencias en la base de datos (igual que en tu función working)
    const [cuadrillaExists, tipoExists] = await Promise.all([
      client.queryObject("SELECT 1 FROM cuadrilla WHERE id = $1", [body.id_cuadrilla]),
      client.queryObject("SELECT 1 FROM tipo_cosecha WHERE id = $1", [body.id_tipo_cosecha])
    ]);

    if (!cuadrillaExists.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La cuadrilla especificada no existe" };
      return;
    }

    if (!tipoExists.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "El tipo de cosecha especificado no existe" };
      return;
    }

    // 5. Insertar en la base de datos (similar a tu función working)
    const result = await client.queryObject(
      `INSERT INTO cosecha 
       (id_cuadrilla, id_tipo_cosecha, fecha_inicio, fecha_fin, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        body.id_cuadrilla,
        body.id_tipo_cosecha,
        body.fecha_inicio,
        body.fecha_fin || null,
        body.estado || 'activa'
      ]
    );

    ctx.response.status = 201;
    ctx.response.body = result.rows[0];

  } catch (error) {
    console.error("Error en addCosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { 
      error: "Error interno del servidor",
      details: error.message 
    };
  }
};

export const updateCosecha = async (ctx: Context) => {
  try {
    // 1. Verificar si hay cuerpo en la solicitud
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No se recibieron datos" };
      return;
    }

    // 2. Obtener parámetro ID y cuerpo como JSON
    const id = ctx.params.id;
    const body = await ctx.request.body.json();

    console.log("Intentando actualizar cosecha ID:", id);
    console.log("Datos recibidos:", body);

    // 3. Validaciones básicas
    if (!body.id_cuadrilla || !body.id_tipo_cosecha || !body.fecha_inicio) {
      ctx.response.status = 400;
      ctx.response.body = { 
        error: "Faltan campos obligatorios",
        required: ["id_cuadrilla", "id_tipo_cosecha", "fecha_inicio"]
      };
      return;
    }

    // 4. Validar referencias en la base de datos
    const [cosechaExistente, cuadrillaExistente, tipoExistente] = await Promise.all([
      client.queryObject("SELECT 1 FROM cosecha WHERE id = $1", [id]),
      client.queryObject("SELECT 1 FROM cuadrilla WHERE id = $1", [body.id_cuadrilla]),
      client.queryObject("SELECT 1 FROM tipo_cosecha WHERE id = $1", [body.id_tipo_cosecha])
    ]);

    if (!cosechaExistente.rowCount) {
      ctx.response.status = 404;
      ctx.response.body = { error: "La cosecha a actualizar no existe" };
      return;
    }

    if (!cuadrillaExistente.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La cuadrilla especificada no existe" };
      return;
    }

    if (!tipoExistente.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "El tipo de cosecha especificado no existe" };
      return;
    }

    // 5. Validación de fechas (solo si fecha_fin está presente)
    if (body.fecha_fin && new Date(body.fecha_fin) < new Date(body.fecha_inicio)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La fecha fin no puede ser anterior a la fecha inicio" };
      return;
    }

    // 6. Actualizar en la base de datos
    const result = await client.queryObject(
      `UPDATE cosecha SET
        id_cuadrilla = $1,
        id_tipo_cosecha = $2,
        fecha_inicio = $3,
        fecha_fin = $4,
        estado = $5
      WHERE id = $6
      RETURNING *`,
      [
        body.id_cuadrilla,
        body.id_tipo_cosecha,
        body.fecha_inicio,
        body.fecha_fin || null,
        body.estado || 'activa',
        id
      ]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        data: result.rows[0],
        message: "Cosecha actualizada exitosamente"
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "No se pudo actualizar la cosecha" };
    }
  } catch (error) {
    console.error("Error en updateCosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Error interno del servidor",
      details: error.message
    };
  }
};

 
export const getReportes = async (ctx: Context) => {
  try {
    const result = await client.queryObject(`
      SELECT 
        rc.id,
        c.id AS id_cosecha,
        co.nombre || ' ' || co.p_apellido AS nombre_cosechador,
        cu.nombre AS nombre_cuadrilla,
        tc.nombre AS nombre_cultivo,
        rc.fecha,
        rc.cantidad_capachos,
        tc.precio_por_capacho
      FROM registro_cosecha rc
      JOIN cosecha c ON rc.id_cosecha = c.id
      JOIN cosechador co ON rc.id_cosechador = co.id
      JOIN cuadrilla cu ON c.id_cuadrilla = cu.id
      JOIN tipo_cosecha tc ON c.id_tipo_cosecha = tc.id
      ORDER BY rc.fecha DESC
    `);
    ctx.response.body = result.rows;
  } catch (error) {
    console.error("Error al cargar reportes:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al cargar reportes", error: error.message };
  }
};
 
export const deleteCosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `DELETE FROM cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Cosecha eliminada exitosamente" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosecha no encontrada" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
};

export const getSingleCosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `SELECT * FROM cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.body = result.rows[0];
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosecha no encontrada" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
};

// Obtener listado de cosechas
export const getCosechasList = async (ctx: Context) => {
  try {
    const query = `
      SELECT c.id, c.fecha_inicio, c.fecha_fin, c.estado, 
             tc.nombre as tipo_cosecha_nombre, tc.id as id_tipo_cosecha,
             cu.nombre as cuadrilla_nombre
      FROM cosecha c
      JOIN tipo_cosecha tc ON c.id_tipo_cosecha = tc.id
      JOIN cuadrilla cu ON c.id_cuadrilla = cu.id
      ORDER BY c.fecha_inicio DESC
    `;
    const result = await client.queryObject(query);
    
    // Formatear fechas y convertir IDs a números
    const formattedData = result.rows.map(row => ({
      ...row,
      id: Number(row.id),
      id_tipo_cosecha: Number(row.id_tipo_cosecha),
      fecha_inicio: new Date(row.fecha_inicio).toISOString(),
      fecha_fin: row.fecha_fin ? new Date(row.fecha_fin).toISOString() : null
    }));
    
    ctx.response.body = formattedData;
    ctx.response.type = "application/json";
  } catch (error) {
    console.error("Error en getCosechasList:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error al obtener las cosechas" };
  }
};

// Obtener tipos de cosecha
export const getTipoCosecha = async (ctx: Context) => {
  try {
    const result = await client.queryObject("SELECT * FROM tipo_cosecha ORDER BY nombre");
    
    // Convertir IDs a números
    const formattedData = result.rows.map(row => ({
      ...row,
      id: Number(row.id),
      precio_por_capacho: Number(row.precio_por_capacho)
    }));
    
    ctx.response.body = formattedData;
    ctx.response.type = "application/json";
  } catch (error) {
    console.error("Error en getTipoCosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error al obtener los tipos de cosecha" };
  }
};

// Obtener capachos por día (solo últimos 5 días)
export const getCapachosPorDia = async (ctx: Context) => {
  try {
    const { idCosecha } = ctx.params;
    
    let query = `
      SELECT 
        fecha, 
        SUM(cantidad_capachos) as total_capachos
      FROM registro_cosecha
    `;
    
    let queryParams = [];
    
    if (idCosecha) {
      query += ` WHERE id_cosecha = $1`;
      queryParams.push(idCosecha);
    }
    
    query += ` GROUP BY fecha ORDER BY fecha DESC LIMIT 5`;
    
    const result = await client.queryObject(query, queryParams);
    
    // Formatear datos para el gráfico (y ordenar ascendente para mejor visualización)
    const formattedData = result.rows
      .map(row => ({
        fecha: new Date(row.fecha).toISOString().split('T')[0],
        total_capachos: Number(row.total_capachos)
      }))
      .reverse(); // Invertir para mostrar del más antiguo al más reciente
    
    ctx.response.body = formattedData;
    ctx.response.type = "application/json";
  } catch (error) {
    console.error("Error en getCapachosPorDia:", error);
    ctx.response.status = 500;
    ctx.response.body = { 
      error: "Error al obtener los capachos por día",
      details: error.message
    };
  }
};

// Obtener capachos por cosechador (solo primeros 5)
export const getCapachosPorCosechador = async (ctx: Context) => {
  try {
    const { idCosecha } = ctx.params;
    
    let query = `
      SELECT 
        co.nombre || ' ' || co.p_apellido as nombre, 
        SUM(rc.cantidad_capachos) as total
      FROM registro_cosecha rc
      JOIN cosechador co ON rc.id_cosechador = co.id
    `;
    
    let queryParams = [];
    
    if (idCosecha) {
      query += ` WHERE rc.id_cosecha = $1`;
      queryParams.push(idCosecha);
    }
    
    query += ` GROUP BY co.nombre, co.p_apellido ORDER BY total DESC LIMIT 5`;
    
    const result = await client.queryObject(query, queryParams);
    
    // Formatear datos para el gráfico
    const formattedData = result.rows.map(row => ({
      nombre: row.nombre,
      total: Number(row.total)
    }));
    
    ctx.response.body = formattedData;
    ctx.response.type = "application/json";
  } catch (error) {
    console.error("Error en getCapachosPorCosechador:", error);
    ctx.response.status = 500;
    ctx.response.body = { 
      error: "Error al obtener los capachos por cosechador",
      details: error.message
    };
  }
};



export const getCosechasConCapachos = async (ctx: Context) => {
  try {
    const query = `
      SELECT
        ch.id AS id_cosecha,
        c.nombre AS cuadrilla,
        tc.nombre AS tipo_cosecha,
        ch.fecha_inicio,
        ch.fecha_fin,
        ch.estado,
        COALESCE(SUM(rc.cantidad_capachos), 0) AS total_capachos
      FROM cosecha ch
      JOIN cuadrilla c ON ch.id_cuadrilla = c.id
      JOIN tipo_cosecha tc ON ch.id_tipo_cosecha = tc.id
      LEFT JOIN registro_cosecha rc ON ch.id = rc.id_cosecha
      GROUP BY ch.id, c.nombre, tc.nombre, ch.fecha_inicio, ch.fecha_fin, ch.estado
      ORDER BY ch.fecha_inicio DESC
    `;
    
    const result = await client.queryObject(query);

    const formattedData = result.rows.map(row => ({
      id_cosecha: row.id_cosecha,
      cuadrilla: row.cuadrilla,
      tipo_cosecha: row.tipo_cosecha,
      fecha_inicio: row.fecha_inicio,
      fecha_fin: row.fecha_fin,
      estado: row.estado,
      total_capachos: Number(row.total_capachos)
    }));

    ctx.response.body = formattedData;
    ctx.response.type = "application/json";
  } catch (error) {
    console.error("Error en getCosechasConCapachos:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Error al obtener las cosechas y capachos",
      details: error.message
    };
  }
};


// Obtener el TOTAL de capachos para una cosecha (todos los días)
// Nuevo endpoint para obtener el total de capachos por cosecha
export const getTotalCapachos = async (ctx: Context) => {
  try {
    const { idCosecha } = ctx.params;
    
    const query = `
      SELECT SUM(cantidad_capachos) as total 
      FROM registro_cosecha 
      WHERE id_cosecha = $1
    `;
    
    const result = await client.queryObject(query, [idCosecha]);
    
    ctx.response.body = {
      total: Number(result.rows[0]?.total) || 0
    };
    ctx.response.status = 200;
  } catch (error) {
    console.error("Error en getTotalCapachos:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error al calcular el total" };
  }
};