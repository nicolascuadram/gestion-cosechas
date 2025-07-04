"use client";

import { useState, useEffect } from "react";
import { Search, UserMinus, UserPlus, Pencil, Trash2, Plus, X, Users } from "lucide-react";

export default function AsignacionCosechadores() {
  // Estados para datos
  const [cosechadores, setCosechadores] = useState([]);
  const [cuadrillas, setCuadrillas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCuadrilla, setFiltroCuadrilla] = useState("todos");
  
  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState({
    agregar: false,
    editar: false,
    eliminar: false
  });
  const [cosechadorSeleccionado, setCosechadorSeleccionado] = useState(null);
  const [cuadrillaAsignar, setCuadrillaAsignar] = useState("");
  
  // Estado para formularios
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    p_apellido: "",
    s_apellido: "",
    id_cuadrilla: ""
  });

  // Estado para errores
  const [error, setError] = useState("");

  // Fetch inicial de datos
  useEffect(() => {
    fetchCosechadores();
    fetchCuadrillas();
  }, []);

  const fetchCosechadores = async () => {
    try {
      const response = await fetch("http://192.168.0.2:8080/cosechadores");
      const data = await response.json();
      setCosechadores(data);
    } catch (err) {
      console.error("Error fetching cosechadores:", err);
      setError("Error al cargar cosechadores");
    }
  };

  const fetchCuadrillas = async () => {
    try {
      const response = await fetch("http://192.168.0.2:8080/cuadrillas");
      const data = await response.json();
      setCuadrillas(data);
    } catch (err) {
      console.error("Error fetching cuadrillas:", err);
      setError("Error al cargar cuadrillas");
    }
  };

  // Filtrado de cosechadores
  const cosechadoresFiltrados = cosechadores.filter((c) => {
    const cumpleBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.p_apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.rut.includes(busqueda);
    
    const cumpleFiltroCuadrilla =
      filtroCuadrilla === "todos" ? true :
      filtroCuadrilla === "sin-asignar" ? !c.id_cuadrilla :
      c.id_cuadrilla === parseInt(filtroCuadrilla);
    
    return cumpleBusqueda && cumpleFiltroCuadrilla;
  });

  // Handlers para modales
  const abrirModalAgregar = () => {
    setFormData({
      rut: "",
      nombre: "",
      p_apellido: "",
      s_apellido: "",
      id_cuadrilla: ""
    });
    setModalAbierto({ ...modalAbierto, agregar: true });
    setError("");
  };

  const abrirModalEditar = (cosechador) => {
    setCosechadorSeleccionado(cosechador);
    setFormData({
      rut: cosechador.rut,
      nombre: cosechador.nombre,
      p_apellido: cosechador.p_apellido,
      s_apellido: cosechador.s_apellido || "",
      id_cuadrilla: cosechador.id_cuadrilla || ""
    });
    setModalAbierto({ ...modalAbierto, editar: true });
    setError("");
  };

  const abrirModalEliminar = (cosechador) => {
    setCosechadorSeleccionado(cosechador);
    setModalAbierto({ ...modalAbierto, eliminar: true });
  };

  const cerrarModales = () => {
    setModalAbierto({
      agregar: false,
      editar: false,
      eliminar: false
    });
    setCosechadorSeleccionado(null);
    setError("");
  };

  // Handlers para acciones
  const handleAsignarCuadrilla = async (cosechadorId, idCuadrilla) => {
    if (!idCuadrilla) return;
    
    try {
      const response = await fetch(`http://192.168.0.2:8080/cosechadores/${cosechadorId}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cuadrilla: parseInt(idCuadrilla) }),
      });

      if (response.ok) {
        fetchCosechadores();
      } else {
        const data = await response.json();
        setError(data.message || "Error al asignar cuadrilla");
      }
    } catch (err) {
      setError("Error de conexión al asignar cuadrilla");
    }
  };

  const handleQuitarCuadrilla = async (cosechadorId) => {
    try {
      const response = await fetch(`http://192.168.0.2:8080/cosechadores/${cosechadorId}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cuadrilla: null }),
      });

      if (response.ok) {
        fetchCosechadores();
      } else {
        const data = await response.json();
        setError(data.message || "Error al quitar cuadrilla");
      }
    } catch (err) {
      setError("Error de conexión al quitar cuadrilla");
    }
  };

  const handleSubmitCosechador = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!formData.rut || !formData.nombre || !formData.p_apellido) {
      setError("RUT, Nombre y Primer Apellido son obligatorios");
      return;
    }

    const isEdit = modalAbierto.editar;
    const url = isEdit 
      ? `http://192.168.0.2:8080/cosechadores/${cosechadorSeleccionado.id}`
      : "http://192.168.0.2:8080/cosechadores";
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut: formData.rut,
          nombre: formData.nombre,
          p_apellido: formData.p_apellido,
          s_apellido: formData.s_apellido || null,
          id_cuadrilla: formData.id_cuadrilla ? parseInt(formData.id_cuadrilla) : null,
        }),
      });

      if (response.ok) {
        fetchCosechadores();
        cerrarModales();
      } else {
        const data = await response.json();
        setError(data.message || `Error al ${isEdit ? 'editar' : 'agregar'} cosechador`);
      }
    } catch (err) {
      setError(`Error de conexión al ${isEdit ? 'editar' : 'agregar'} cosechador`);
    }
  };

  const handleEliminarCosechador = async () => {
    if (!cosechadorSeleccionado) return;
    
    try {
      const response = await fetch(`http://192.168.0.2:8080/cosechadores/${cosechadorSeleccionado.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCosechadores();
        cerrarModales();
      } else {
        const data = await response.json();
        setError(data.message || "Error al eliminar cosechador");
      }
    } catch (err) {
      setError("Error de conexión al eliminar cosechador");
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">Gestión de Cosechadores</h2>
          <p className="text-[#737373]">Administra los cosechadores y su asignación a cuadrillas</p>
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700 transition"
          onClick={abrirModalAgregar}
        >
          <Plus className="h-4 w-4" />
          Agregar Cosechador
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="border rounded-sm pl-10 pr-4 py-2 w-full outline-offset-1 outline-[#16a34a]"
              placeholder="Buscar por nombre, apellido o RUT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <select
            className="border rounded-sm px-4 py-2 w-full"
            value={filtroCuadrilla}
            onChange={(e) => setFiltroCuadrilla(e.target.value)}
          >
            <option value="todos">Todos los cosechadores</option>
            <option value="sin-asignar">Sin cuadrilla asignada</option>
            {cuadrillas.map((cuadrilla) => (
              <option key={cuadrilla.id} value={cuadrilla.id}>
                {cuadrilla.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Nombre Completo</th>
              <th className="p-3 font-medium">RUT</th>
              <th className="p-3 font-medium">Cuadrilla</th>
              <th className="p-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cosechadoresFiltrados.length > 0 ? (
              cosechadoresFiltrados.map((cosechador) => (
                <tr key={cosechador.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{cosechador.id}</td>
                  <td className="p-3">
                    {`${cosechador.nombre} ${cosechador.p_apellido}${cosechador.s_apellido ? ' ' + cosechador.s_apellido : ''}`}
                  </td>
                  <td className="p-3">{cosechador.rut}</td>
                  <td className="p-3">
                    {cosechador.cuadrilla_nombre ? (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-600" />
                        {cosechador.cuadrilla_nombre}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {/* Select para asignar cuadrilla */}
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAsignarCuadrilla(cosechador.id, e.target.value);
                          }
                        }}
                      >
                        <option value="">Asignar a...</option>
                        {cuadrillas.map((cuadrilla) => (
                          <option key={cuadrilla.id} value={cuadrilla.id}>
                            {cuadrilla.nombre}
                          </option>
                        ))}
                      </select>

                      {/* Botón para quitar cuadrilla */}
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${cosechador.id_cuadrilla 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        onClick={() => handleQuitarCuadrilla(cosechador.id)}
                        disabled={!cosechador.id_cuadrilla}
                      >
                        <UserMinus className="h-4 w-4" />
                        Quitar
                      </button>

                      {/* Botón editar */}
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                        onClick={() => abrirModalEditar(cosechador)}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>

                      {/* Botón eliminar */}
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        onClick={() => abrirModalEliminar(cosechador)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No se encontraron cosechadores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles y tablets */}
      <div className="lg:hidden space-y-4">
        {cosechadoresFiltrados.length > 0 ? (
          cosechadoresFiltrados.map((cosechador) => (
            <div key={cosechador.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {`${cosechador.nombre} ${cosechador.p_apellido}${cosechador.s_apellido ? ' ' + cosechador.s_apellido : ''}`}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {cosechador.id} • RUT: {cosechador.rut}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <span className="font-medium text-gray-700">Cuadrilla:</span>
                {cosechador.cuadrilla_nombre ? (
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{cosechador.cuadrilla_nombre}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-1">Sin asignar</p>
                )}
              </div>

              {/* Acciones en móvil */}
              <div className="space-y-2">
                {/* Select para asignar cuadrilla */}
                <select
                  className="border border-gray-300 rounded px-3 py-2 w-full text-sm bg-white"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAsignarCuadrilla(cosechador.id, e.target.value);
                    }
                  }}
                >
                  <option value="">Asignar a cuadrilla...</option>
                  {cuadrillas.map((cuadrilla) => (
                    <option key={cuadrilla.id} value={cuadrilla.id}>
                      {cuadrilla.nombre}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  {/* Botón para quitar cuadrilla */}
                  <button
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded text-sm flex-1 ${cosechador.id_cuadrilla 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    onClick={() => handleQuitarCuadrilla(cosechador.id)}
                    disabled={!cosechador.id_cuadrilla}
                  >
                    <UserMinus className="h-4 w-4" />
                    Quitar
                  </button>

                  {/* Botón editar */}
                  <button
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex-1"
                    onClick={() => abrirModalEditar(cosechador)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>

                  {/* Botón eliminar */}
                  <button
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex-1"
                    onClick={() => abrirModalEliminar(cosechador)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No se encontraron cosechadores
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar Cosechador */}
      {(modalAbierto.agregar || modalAbierto.editar) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {modalAbierto.editar ? "Editar Cosechador" : "Agregar Cosechador"}
              </h2>
              <button onClick={cerrarModales}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCosechador}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">RUT *</label>
                  <input
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    placeholder="12345678-9"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Primer Apellido *</label>
                  <input
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    value={formData.p_apellido}
                    onChange={(e) => setFormData({ ...formData, p_apellido: e.target.value })}
                    placeholder="Primer Apellido"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Segundo Apellido</label>
                  <input
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    value={formData.s_apellido}
                    onChange={(e) => setFormData({ ...formData, s_apellido: e.target.value })}
                    placeholder="Segundo Apellido (opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cuadrilla (opcional)</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    value={formData.id_cuadrilla}
                    onChange={(e) => setFormData({ ...formData, id_cuadrilla: e.target.value })}
                  >
                    <option value="">Sin asignar</option>
                    {cuadrillas.map((cuadrilla) => (
                      <option key={cuadrilla.id} value={cuadrilla.id}>
                        {cuadrilla.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={cerrarModales}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {modalAbierto.editar ? "Guardar Cambios" : "Agregar Cosechador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Cosechador */}
      {modalAbierto.eliminar && cosechadorSeleccionado && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Confirmar eliminación</h2>
              <button onClick={cerrarModales}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4">
              ¿Estás seguro de eliminar al cosechador{" "}
              <strong>{cosechadorSeleccionado.nombre} {cosechadorSeleccionado.p_apellido}</strong>?
            </p>

            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={cerrarModales}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleEliminarCosechador}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}