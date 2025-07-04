"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, Check, X, Plus, Pencil, Trash2, ChevronDown } from "lucide-react";

export default function GestionCosechas() {
  // Estados para datos
  const [cosechas, setCosechas] = useState([]);
  const [cuadrillas, setCuadrillas] = useState([]);
  const [tiposCosecha, setTiposCosecha] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  
  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState({
    agregar: false,
    editar: false,
    eliminar: false
  });
  const [cosechaSeleccionada, setCosechaSeleccionada] = useState(null);
  
  // Estado para formularios
  const [formDataAgregar, setFormDataAgregar] = useState({
    id_cuadrilla: "",
    id_tipo_cosecha: "",
    fecha_inicio: new Date(),
    fecha_fin: null,
    estado: "activa"
  });

  const [formDataEditar, setFormDataEditar] = useState({
    id_cuadrilla: "",
    id_tipo_cosecha: "",
    fecha_inicio: new Date(),
    fecha_fin: null,
    estado: "activa"
  });

  // Estado para errores
  const [error, setError] = useState("");

  // Fetch inicial de datos
  useEffect(() => {
    fetchCosechas();
    fetchCuadrillas();
    fetchTiposCosecha();
  }, []);

  const fetchCosechas = async () => {
    try {
      const response = await fetch("http://192.168.0.2:8080/administrador/cosecha");
      const data = await response.json();
      setCosechas(data);
    } catch (err) {
      console.error("Error fetching cosechas:", err);
      setError("Error al cargar cosechas");
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

  const fetchTiposCosecha = async () => {
    try {
      const response = await fetch("http://192.168.0.2:8080/administrador/getTipo_cosecha");
      const data = await response.json();
      setTiposCosecha(data);
    } catch (err) {
      console.error("Error fetching tipos de cosecha:", err);
      setError("Error al cargar tipos de cosecha");
    }
  };

  // Filtrado de cosechas
  const cosechasFiltradas = cosechas.filter((c) => {
    const cumpleBusqueda =
      c.cuadrilla_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.tipo_cosecha_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.id.toString().includes(busqueda);
    
    const cumpleFiltroEstado =
      filtroEstado === "todos" ? true : c.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleFiltroEstado;
  });

  // Handlers para modales
  const abrirModalAgregar = () => {
    setFormDataAgregar({
      id_cuadrilla: "",
      id_tipo_cosecha: "",
      fecha_inicio: new Date(),
      fecha_fin: null,
      estado: "activa"
    });
    setModalAbierto({ ...modalAbierto, agregar: true });
    setError("");
  };

  const abrirModalEditar = (cosecha) => {
    setCosechaSeleccionada(cosecha);
    setFormDataEditar({
      id_cuadrilla: cosecha.id_cuadrilla,
      id_tipo_cosecha: cosecha.id_tipo_cosecha,
      fecha_inicio: new Date(cosecha.fecha_inicio),
      fecha_fin: cosecha.fecha_fin ? new Date(cosecha.fecha_fin) : null,
      estado: cosecha.estado
    });
    setModalAbierto({ ...modalAbierto, editar: true });
    setError("");
  };

  const abrirModalEliminar = (cosecha) => {
    setCosechaSeleccionada(cosecha);
    setModalAbierto({ ...modalAbierto, eliminar: true });
  };

  const cerrarModales = () => {
    setModalAbierto({
      agregar: false,
      editar: false,
      eliminar: false
    });
    setCosechaSeleccionada(null);
    setError("");
  };

  // Handlers para cambios en los formularios
  const handleChangeAgregar = (e) => {
    const { name, value } = e.target;
    setFormDataAgregar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeEditar = (e) => {
    const { name, value } = e.target;
    setFormDataEditar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChangeAgregar = (date, field) => {
    setFormDataAgregar(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleDateChangeEditar = (date, field) => {
    setFormDataEditar(prev => ({
      ...prev,
      [field]: date
    }));
  };

  // Handler para agregar cosecha (POST)
  const handleAgregarCosecha = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formDataAgregar.id_cuadrilla || !formDataAgregar.id_tipo_cosecha || !formDataAgregar.fecha_inicio) {
      setError("Cuadrilla, Tipo de Cosecha y Fecha de Inicio son obligatorios");
      return;
    }

    try {
      const payload = {
        id_cuadrilla: Number(formDataAgregar.id_cuadrilla),
        id_tipo_cosecha: Number(formDataAgregar.id_tipo_cosecha),
        fecha_inicio: formDataAgregar.fecha_inicio.toISOString().split('T')[0],
        fecha_fin: formDataAgregar.fecha_fin ? formDataAgregar.fecha_fin.toISOString().split('T')[0] : null,
        estado: formDataAgregar.estado || 'activa'
      };

      const response = await fetch("http://192.168.0.2:8080/administrador/cosecha", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || "Error al crear cosecha");
      }

      fetchCosechas();
      cerrarModales();
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Error al crear cosecha");
    }
  };

  // Handler para editar cosecha (PUT)
  const handleEditarCosecha = async (e) => {
    e.preventDefault();

    if (!cosechaSeleccionada) return;

    // Validación básica
    if (!formDataEditar.id_cuadrilla || !formDataEditar.id_tipo_cosecha || !formDataEditar.fecha_inicio) {
      setError("Cuadrilla, Tipo de Cosecha y Fecha de Inicio son obligatorios");
      return;
    }

    try {
      const payload = {
        id_cuadrilla: Number(formDataEditar.id_cuadrilla),
        id_tipo_cosecha: Number(formDataEditar.id_tipo_cosecha),
        fecha_inicio: formDataEditar.fecha_inicio.toISOString().split('T')[0],
        fecha_fin: formDataEditar.fecha_fin ? formDataEditar.fecha_fin.toISOString().split('T')[0] : null,
        estado: formDataEditar.estado || 'activa'
      };

      const response = await fetch(`http://192.168.0.2:8080/administrador/cosecha/${cosechaSeleccionada.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar cosecha");
      }

      fetchCosechas();
      cerrarModales();
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Error al actualizar cosecha");
    }
  };

  const handleEliminarCosecha = async () => {
    if (!cosechaSeleccionada) return;
    
    try {
      const response = await fetch(`http://192.168.0.2:8080/administrador/cosecha/${cosechaSeleccionada.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCosechas();
        cerrarModales();
      } else {
        const data = await response.json();
        setError(data.message || "Error al eliminar cosecha");
      }
    } catch (err) {
      setError("Error de conexión al eliminar cosecha");
    }
  };

  // Formatear fecha para mostrar
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  // Obtener nombre de cuadrilla por ID
  const getNombreCuadrilla = (id) => {
    const cuadrilla = cuadrillas.find(c => c.id === id);
    return cuadrilla ? cuadrilla.nombre : "Desconocida";
  };

  // Obtener nombre de tipo de cosecha por ID
  const getNombreTipoCosecha = (id) => {
    const tipo = tiposCosecha.find(t => t.id === id);
    return tipo ? tipo.nombre : "Desconocido";
  };

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">Gestión de Cosechas</h2>
          <p className="text-[#737373]">Administra las cosechas registradas</p>
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700 transition"
          onClick={abrirModalAgregar}
        >
          <Plus className="h-4 w-4" />
          Nueva Cosecha
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative" style={{textAlign: "center"}}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="border rounded-sm pl-10 pr-4 py-2 w-full outline-offset-1 outline-[#16a34a]"
              placeholder="Buscar por cuadrilla, tipo de cosecha o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <select
            className="border rounded-sm px-4 py-2 w-full"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
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
      <div className="hidden md:block overflow-x-auto rounded-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Cuadrilla</th>
              <th className="p-3 font-medium">Tipo de Cosecha</th>
              <th className="p-3 font-medium">Fecha Inicio</th>
              <th className="p-3 font-medium">Fecha Fin</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cosechasFiltradas.length > 0 ? (
              cosechasFiltradas.map((cosecha) => (
                <tr key={cosecha.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{cosecha.id}</td>
                  <td className="p-3">{getNombreCuadrilla(cosecha.id_cuadrilla)}</td>
                  <td className="p-3">{getNombreTipoCosecha(cosecha.id_tipo_cosecha)}</td>
                  <td className="p-3">{formatFecha(cosecha.fecha_inicio)}</td>
                  <td className="p-3">{formatFecha(cosecha.fecha_fin)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cosecha.estado === 'activa' ? 'bg-blue-100 text-blue-800' :
                      cosecha.estado === 'completada' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cosecha.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {/* Botón editar */}
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                        onClick={() => abrirModalEditar(cosecha)}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>

                      {/* Botón eliminar */}
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        onClick={() => abrirModalEliminar(cosecha)}
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
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No se encontraron cosechas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-4">
        {cosechasFiltradas.length > 0 ? (
          cosechasFiltradas.map((cosecha) => (
            <div key={cosecha.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{getNombreCuadrilla(cosecha.id_cuadrilla)}</h3>
                  <p className="text-sm text-gray-600">ID: {cosecha.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  cosecha.estado === 'activa' ? 'bg-blue-100 text-blue-800' :
                  cosecha.estado === 'completada' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cosecha.estado}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div>
                  <span className="font-medium text-gray-700">Tipo de Cosecha:</span>
                  <p className="text-sm">{getNombreTipoCosecha(cosecha.id_tipo_cosecha)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha de Inicio:</span>
                  <p className="text-sm">{formatFecha(cosecha.fecha_inicio)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha de Fin:</span>
                  <p className="text-sm">{formatFecha(cosecha.fecha_fin) || "No definida"}</p>
                </div>
              </div>

              {/* Acciones en móvil */}
              <div className="flex gap-2">
                <button
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex-1"
                  onClick={() => abrirModalEditar(cosecha)}
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>
                <button
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex-1"
                  onClick={() => abrirModalEliminar(cosecha)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No se encontraron cosechas
          </div>
        )}
      </div>

      {/* Modal Agregar Cosecha */}
      {modalAbierto.agregar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Agregar Cosecha</h2>
              <button onClick={cerrarModales}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAgregarCosecha}>
              <div className="space-y-4">
                {/* Cuadrilla */}
                <div>
                  <label className="block text-sm font-medium mb-1">Cuadrilla *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="id_cuadrilla"
                    value={formDataAgregar.id_cuadrilla}
                    onChange={handleChangeAgregar}
                    required
                  >
                    <option value="">Seleccione una cuadrilla</option>
                    {cuadrillas.map((cuadrilla) => (
                      <option key={cuadrilla.id} value={cuadrilla.id}>
                        {cuadrilla.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Cosecha */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Cosecha *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="id_tipo_cosecha"
                    value={formDataAgregar.id_tipo_cosecha}
                    onChange={handleChangeAgregar}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposCosecha.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Inicio *</label>
                  <div className="relative" style={{textAlign: "center"}}>
                    <DatePicker
                      selected={formDataAgregar.fecha_inicio}
                      onChange={(date) => handleDateChangeAgregar(date, 'fecha_inicio')}
                      dateFormat="dd/MM/yyyy"
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200 pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Fin (opcional)</label>
                  <div className="relative" style={{textAlign: "center"}}>
                    <DatePicker
                      selected={formDataAgregar.fecha_fin}
                      onChange={(date) => handleDateChangeAgregar(date, 'fecha_fin')}
                      dateFormat="dd/MM/yyyy"
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200 pl-10"
                      isClearable
                      placeholderText="Seleccione una fecha"
                      minDate={formDataAgregar.fecha_inicio}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium mb-1">Estado *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="estado"
                    value={formDataAgregar.estado}
                    onChange={handleChangeAgregar}
                    required
                  >
                    <option value="activa">Activa</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>

              {/* Botones */}
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
                  Agregar Cosecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Cosecha */}
      {modalAbierto.editar && cosechaSeleccionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Editar Cosecha</h2>
              <button onClick={cerrarModales}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditarCosecha}>
              <div className="space-y-4">
                {/* Cuadrilla */}
                <div>
                  <label className="block text-sm font-medium mb-1">Cuadrilla *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="id_cuadrilla"
                    value={formDataEditar.id_cuadrilla}
                    onChange={handleChangeEditar}
                    required
                  >
                    <option value="">Seleccione una cuadrilla</option>
                    {cuadrillas.map((cuadrilla) => (
                      <option key={cuadrilla.id} value={cuadrilla.id}>
                        {cuadrilla.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Cosecha */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Cosecha *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="id_tipo_cosecha"
                    value={formDataEditar.id_tipo_cosecha}
                    onChange={handleChangeEditar}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposCosecha.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Inicio *</label>
                  <div className="relative" style={{textAlign: "center"}}>
                    <DatePicker
                      selected={formDataEditar.fecha_inicio}
                      onChange={(date) => handleDateChangeEditar(date, 'fecha_inicio')}
                      dateFormat="dd/MM/yyyy"
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200 pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Fin (opcional)</label>
                  <div className="relative" style={{textAlign: "center"}}>
                    <DatePicker
                      selected={formDataEditar.fecha_fin}
                      onChange={(date) => handleDateChangeEditar(date, 'fecha_fin')}
                      dateFormat="dd/MM/yyyy"
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200 pl-10"
                      isClearable
                      placeholderText="Seleccione una fecha"
                      minDate={formDataEditar.fecha_inicio}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium mb-1">Estado *</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-200"
                    name="estado"
                    value={formDataEditar.estado}
                    onChange={handleChangeEditar}
                    required
                  >
                    <option value="activa">Activa</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
              </div>

              {/* Botones */}
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
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar Cosecha */}
      {modalAbierto.eliminar && cosechaSeleccionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Confirmar eliminación</h2>
              <button onClick={cerrarModales}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4">
              ¿Estás seguro de eliminar la cosecha de la cuadrilla{" "}
              <strong>{getNombreCuadrilla(cosechaSeleccionada.id_cuadrilla)}</strong>?
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
                onClick={handleEliminarCosecha}
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