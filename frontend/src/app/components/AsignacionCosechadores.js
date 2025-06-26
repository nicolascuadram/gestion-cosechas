"use client";

import { useState, useEffect } from "react";
import { Search, UserMinus, UserPlus, Pencil, Trash2, Plus } from "lucide-react";

export default function AsignacionCosechadores() {
  const [cosechadores, setCosechadores] = useState([]);
  const [cuadrillas, setCuadrillas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCuadrilla, setFiltroCuadrilla] = useState("todos");
  const [cuadrillaSeleccionada, setCuadrillaSeleccionada] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCosechador, setEditingCosechador] = useState(null);
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    p_apellido: "",
    s_apellido: "",
    id_cuadrilla: "",
  });
  const [error, setError] = useState("");

  // Fetch cosechadores and cuadrillas on mount
  useEffect(() => {
    fetchCosechadores();
    fetchCuadrillas();
  }, []);

  const fetchCosechadores = async () => {
    try {
      const response = await fetch("http://localhost:8080/cosechadores");
      const data = await response.json();
      setCosechadores(data);
    } catch (err) {
      console.error("Error fetching cosechadores:", err);
    }
  };

  const fetchCuadrillas = async () => {
    try {
      const response = await fetch("http://localhost:8080/cuadrillas");
      const data = await response.json();
      setCuadrillas(data);
    } catch (err) {
      console.error("Error fetching cuadrillas:", err);
    }
  };

  const handleAsignarCuadrilla = async (cosechadorId) => {
    if (!cuadrillaSeleccionada) return;
    try {
      const response = await fetch(`http://localhost:8080/cosechadores/${cosechadorId}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cuadrilla: parseInt(cuadrillaSeleccionada) }),
      });
      if (response.ok) {
        fetchCosechadores();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error al asignar cuadrilla");
    }
  };

  const handleQuitarCuadrilla = async (cosechadorId) => {
    try {
      const response = await fetch(`http://localhost:8080/cosechadores/${cosechadorId}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cuadrilla: null }),
      });
      if (response.ok) {
        fetchCosechadores();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error al quitar cuadrilla");
    }
  };

  const handleAddOrEditCosechador = async () => {
    // Validate required fields
    if (!formData.rut || !formData.nombre || !formData.p_apellido) {
      setError("RUT, Nombre y Primer Apellido son obligatorios");
      return;
    }

    try {
      const url = editingCosechador
        ? `http://localhost:8080/cosechadores/${editingCosechador.id}`
        : "http://localhost:8080/cosechadores";
      const method = editingCosechador ? "PUT" : "POST";

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
        setIsModalOpen(false);
        setFormData({ rut: "", nombre: "", p_apellido: "", s_apellido: "", id_cuadrilla: "" });
        setEditingCosechador(null);
        setError("");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error al guardar cosechador");
    }
  };

  const handleDeleteCosechador = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este cosechador?")) return;
    try {
      const response = await fetch(`http://localhost:8080/cosechadores/${id}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        fetchCosechadores();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Error al eliminar cosechador");
    }
  };

  const openModal = (cosechador = null) => {
    setEditingCosechador(cosechador);
    setFormData(
      cosechador
        ? {
            rut: cosechador.rut,
            nombre: cosechador.nombre,
            p_apellido: cosechador.p_apellido,
            s_apellido: cosechador.s_apellido || "",
            id_cuadrilla: cosechador.id_cuadrilla || "",
          }
        : { rut: "", nombre: "", p_apellido: "", s_apellido: "", id_cuadrilla: "" }
    );
    setIsModalOpen(true);
    setError("");
  };

  // Filter cosechadores
  const cosechadoresFiltrados = cosechadores.filter((c) => {
    const cumpleBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.rut.includes(busqueda);
    const cumpleFiltroCuadrilla =
      filtroCuadrilla === "todos"
        ? true
        : filtroCuadrilla === "sin-asignar"
        ? c.id_cuadrilla === null
        : c.id_cuadrilla === parseInt(filtroCuadrilla);
    return cumpleBusqueda && cumpleFiltroCuadrilla;
  });

  return (
    <div className="bg-white rounded-lg shadow p-8 w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-green-700 flex items-center gap-2">
          <UserPlus className="h-7 w-7" /> Gestión de Cosechadores
        </h2>
        <p className="text-gray-500 mb-6">Administra los cosechadores asignados a cuadrillas</p>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              className="border border-gray-300 rounded-md px-10 py-2 w-full focus:ring-2 focus:ring-green-200 transition"
              placeholder="Buscar por nombre o RUT..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 min-w-[180px] focus:ring-2 focus:ring-green-200 transition"
            value={filtroCuadrilla}
            onChange={(e) => setFiltroCuadrilla(e.target.value)}
          >
            <option value="todos">Todas las cuadrillas</option>
            <option value="sin-asignar">Sin asignar</option>
            {cuadrillas.map((cuadrilla) => (
              <option key={cuadrilla.id} value={cuadrilla.id}>
                {cuadrilla.nombre}
              </option>
            ))}
          </select>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => openModal()}
          >
            <Plus className="h-5 w-5" />
            Agregar Cosechador
          </button>
        </div>
        {error && <p className="text-red-500 font-medium">{error}</p>}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-green-50 border-b">
              <th className="p-3 font-semibold text-gray-700">ID</th>
              <th className="p-3 font-semibold text-gray-700">Nombre</th>
              <th className="p-3 font-semibold text-gray-700">RUT</th>
              <th className="p-3 font-semibold text-gray-700">Cuadrilla Actual</th>
              <th className="p-3 font-semibold text-gray-700">Asignar a</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cosechadoresFiltrados.map((cosechador, idx) => (
              <tr key={cosechador.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3">{cosechador.id}</td>
                <td className="p-3">{`${cosechador.nombre} ${cosechador.p_apellido}`}</td>
                <td className="p-3">{cosechador.rut}</td>
                <td className="p-3">
                  {cosechador.cuadrilla_nombre || (
                    <span className="text-gray-400 italic">Sin asignar</span>
                  )}
                </td>
                <td className="p-3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 bg-white"
                    value={cuadrillaSeleccionada}
                    onChange={(e) => setCuadrillaSeleccionada(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {cuadrillas.map((cuadrilla) => (
                      <option key={cuadrilla.id} value={cuadrilla.id}>
                        {cuadrilla.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="flex items-center gap-1 border border-green-600 rounded px-3 py-1 text-green-700 hover:bg-green-50 disabled:opacity-50 transition"
                      onClick={() => handleAsignarCuadrilla(cosechador.id)}
                      disabled={!cuadrillaSeleccionada}
                    >
                      <UserPlus className="h-4 w-4" />
                      Asignar
                    </button>
                    <button
                      className="flex items-center gap-1 border border-red-600 rounded px-3 py-1 text-red-700 hover:bg-red-50 disabled:opacity-50 transition"
                      onClick={() => handleQuitarCuadrilla(cosechador.id)}
                      disabled={!cosechador.id_cuadrilla}
                    >
                      <UserMinus className="h-4 w-4" />
                      Quitar
                    </button>
                    <button
                      className="flex items-center gap-1 border border-blue-600 rounded px-3 py-1 text-blue-700 hover:bg-blue-50 transition"
                      onClick={() => openModal(cosechador)}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      className="flex items-center gap-1 border border-red-600 rounded px-3 py-1 text-red-700 hover:bg-red-100 transition"
                      onClick={() => handleDeleteCosechador(cosechador.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cosechadoresFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No se encontraron cosechadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Cosechador */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-green-700">
              {editingCosechador ? "Editar Cosechador" : "Agregar Cosechador"}
            </h3>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="border rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="border rounded px-4 py-2 text-white bg-green-700 hover:bg-green-800"
                  onClick={handleAddOrEditCosechador}
                >
                  {editingCosechador ? "Guardar" : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}