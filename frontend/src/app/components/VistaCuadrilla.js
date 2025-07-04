"use client"

import { useState, useEffect } from "react"
import { Search, User, Calendar, Package } from "lucide-react"
import GenerarQR from './GenerarQR';

export default function VistaCuadrilla() {
  const [cosechadores, setCosechadores] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [nombreCuadrilla, setNombreCuadrilla] = useState("")

  useEffect(() => {
    // Suponiendo que el usuario logueado está en localStorage bajo "user"
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
      setError("No hay sesión activa")
      setLoading(false)
      return
    }
    fetch(`http://localhost:8080/mi-cuadrilla/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("No tienes cuadrilla asignada")
        return res.json()
      })
      .then(data => {
        setNombreCuadrilla(data.nombre)
        // Si tus cosechadores no tienen estado, ultimaEntrega o cantidadUltima, deberás adaptar esto
        setCosechadores(
          data.cosechadores.map(c => ({
            id: c.id,
            nombre: `${c.nombre} ${c.p_apellido}`,
            documento: c.rut || c.documento || "",
            estado: c.estado || "activo", // Ajusta según tu modelo
                ultimaEntrega: c.ultimaEntrega 
      ? formatDateTime(c.ultimaEntrega) 
      : "-",
            cantidadUltima: c.cantidadUltima || "-",
          }))
        )
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Filtrar cosechadores
  const cosechadoresFiltrados = cosechadores.filter((c) => {
    const cumpleBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.documento.includes(busqueda)
    const cumpleFiltroEstado = filtroEstado === null || c.estado === filtroEstado
    return cumpleBusqueda && cumpleFiltroEstado
  })

  function formatDateTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "-";

  const pad = (n) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}-${month}-${year}`;
}

  if (loading) return <div>Cargando...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="bg-white rounded-sm shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mi Cuadrilla {nombreCuadrilla && `- ${nombreCuadrilla}`}</h2>
        <p className="text-gray-500">Visualiza todos los cosechadores a tu cargo</p>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-sm w-full focus:outline-hidden focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroEstado(null)}
            className={`px-4 py-2 rounded font-medium border ${
              filtroEstado === null
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltroEstado("activo")}
            className={`px-4 py-2 rounded font-medium border ${
              filtroEstado === "activo"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFiltroEstado("inactivo")}
            className={`px-4 py-2 rounded font-medium border ${
              filtroEstado === "inactivo"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cosechadoresFiltrados.map((cosechador) => (
          <div key={cosechador.id} className="border rounded-sm shadow-xs overflow-hidden bg-white flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{cosechador.nombre}</h3>
                    <p className="text-sm text-gray-400">{cosechador.documento}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cosechador.estado === "activo"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {cosechador.estado === "activo" ? "Activo" : "Inactivo"}
                </span>
              </div>
              
              
              <div className="mt-4 space-y-3">
  {/* Fecha de última entrega - Versión mejorada */}
  <div className="flex items-start text-sm text-gray-600">
    <Calendar className="h-5 w-5 mr-3 text-indigo-400 flex-shrink-0" />
    <div>
      <span className="font-medium text-gray-700 mr-1">Entrega:</span>
      <span className="text-gray-800 break-words">
        {cosechador.ultimaEntrega}
      </span>
    </div>
  </div>

  {/* Cantidad - Versión consistente */}
  <div className="flex items-center text-sm text-gray-600">
    <Package className="h-5 w-5 mr-3 text-indigo-400 flex-shrink-0" />
    <div>
      <span className="font-medium text-gray-700 mr-1">Cantidad:</span>
      <span className="text-gray-800">{cosechador.cantidadUltima} capachos</span>
    </div>
  </div>
</div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <GenerarQR id={cosechador.id} rut={cosechador.documento} nombre={cosechador.nombre} />
              {/* <button className="px-4 py-1 border rounded-sm text-sm font-medium hover:bg-gray-100">
                Gestionar
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}