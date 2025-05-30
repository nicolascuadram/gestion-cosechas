"use client"

import { useState } from "react"
import { Search, User, Calendar, Package } from "lucide-react"

// Datos hardcodeados
const cosechadoresIniciales = [
  {
    id: 1,
    nombre: "Pedro Gómez",
    documento: "12345678-9",
    estado: "activo",
    ultimaEntrega: "2023-05-15",
    cantidadUltima: 25,
  },
  {
    id: 2,
    nombre: "Ana Martínez",
    documento: "98765432-1",
    estado: "activo",
    ultimaEntrega: "2023-05-15",
    cantidadUltima: 30,
  },
  {
    id: 3,
    nombre: "Luis Sánchez",
    documento: "45678912-3",
    estado: "activo",
    ultimaEntrega: "2023-05-15",
    cantidadUltima: 28,
  },
  {
    id: 4,
    nombre: "Carmen Díaz",
    documento: "78912345-6",
    estado: "inactivo",
    ultimaEntrega: "2023-05-10",
    cantidadUltima: 22,
  },
  {
    id: 5,
    nombre: "Roberto Flores",
    documento: "32165498-7",
    estado: "activo",
    ultimaEntrega: "2023-05-14",
    cantidadUltima: 27,
  },
]

export default function VistaCuadrilla() {
  const [cosechadores, setCosechadores] = useState(cosechadoresIniciales)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState(null)

  // Filtrar cosechadores
  const cosechadoresFiltrados = cosechadores.filter((c) => {
    const cumpleBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.documento.includes(busqueda)
    const cumpleFiltroEstado = filtroEstado === null || c.estado === filtroEstado
    return cumpleBusqueda && cumpleFiltroEstado
  })

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Mi Cuadrilla</h2>
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
              className="pl-10 pr-3 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-200"
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
          <div key={cosechador.id} className="border rounded shadow-sm overflow-hidden bg-white flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between">
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
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-500">Última entrega:</span>
                  <span className="ml-1">{cosechador.ultimaEntrega}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Package className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-500">Cantidad:</span>
                  <span className="ml-1">{cosechador.cantidadUltima} capachos</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-end">
              <button className="px-4 py-1 border rounded text-sm font-medium hover:bg-gray-100">
                Gestionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}