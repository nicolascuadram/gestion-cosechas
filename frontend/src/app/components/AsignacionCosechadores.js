"use client"

import { useState } from "react"
import { Search, UserMinus, UserPlus } from "lucide-react"

// Datos de ejemplo
const cosechadoresIniciales = [
  { id: 1, nombre: "Pedro Gómez", documento: "12345678-9", encargadoId: 1, encargado: "Juan Pérez" },
  { id: 2, nombre: "Ana Martínez", documento: "98765432-1", encargadoId: 1, encargado: "Juan Pérez" },
  { id: 3, nombre: "Luis Sánchez", documento: "45678912-3", encargadoId: 2, encargado: "María López" },
  { id: 4, nombre: "Carmen Díaz", documento: "78912345-6", encargadoId: 2, encargado: "María López" },
  { id: 5, nombre: "Roberto Flores", documento: "32165498-7", encargadoId: 3, encargado: "Carlos Rodríguez" },
  { id: 6, nombre: "Sofía Vargas", documento: "65498732-1", encargadoId: null, encargado: null },
  { id: 7, nombre: "Miguel Torres", documento: "95175382-4", encargadoId: null, encargado: null },
]

const encargados = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María López" },
  { id: 3, nombre: "Carlos Rodríguez" },
]

export default function AsignacionCosechadores() {
  const [cosechadores, setCosechadores] = useState(cosechadoresIniciales)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEncargado, setFiltroEncargado] = useState("todos")
  const [encargadoSeleccionado, setEncargadoSeleccionado] = useState("")

  const handleAsignarEncargado = (cosechadorId) => {
    if (!encargadoSeleccionado) return
    const encargadoId = parseInt(encargadoSeleccionado)
    const encargado = encargados.find((e) => e.id === encargadoId)
    setCosechadores(
      cosechadores.map((c) =>
        c.id === cosechadorId ? { ...c, encargadoId, encargado: encargado?.nombre || null } : c
      )
    )
  }

  const handleQuitarEncargado = (cosechadorId) => {
    setCosechadores(
      cosechadores.map((c) =>
        c.id === cosechadorId ? { ...c, encargadoId: null, encargado: null } : c
      )
    )
  }

  // Filtrar cosechadores
  const cosechadoresFiltrados = cosechadores.filter((c) => {
    const cumpleBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.documento.includes(busqueda)
    const cumpleFiltroEncargado =
      filtroEncargado === "todos"
        ? true
        : filtroEncargado === "sin-asignar"
        ? c.encargadoId === null
        : c.encargadoId === parseInt(filtroEncargado)
    return cumpleBusqueda && cumpleFiltroEncargado
  })

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Asignación de Cosechadores</h2>
        <p className="text-gray-500 mb-4">Asigna cosechadores a encargados de cuadrilla</p>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              className="border rounded px-8 py-2 w-full"
              placeholder="Buscar por nombre o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select
            className="border rounded px-4 py-2 min-w-[180px]"
            value={filtroEncargado}
            onChange={(e) => setFiltroEncargado(e.target.value)}
          >
            <option value="todos">Todos los cosechadores</option>
            <option value="sin-asignar">Sin asignar</option>
            {encargados.map((encargado) => (
              <option key={encargado.id} value={encargado.id}>
                {encargado.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Documento</th>
              <th className="p-2">Encargado Actual</th>
              <th className="p-2">Asignar a</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cosechadoresFiltrados.map((cosechador) => (
              <tr key={cosechador.id} className="border-t">
                <td className="p-2">{cosechador.id}</td>
                <td className="p-2">{cosechador.nombre}</td>
                <td className="p-2">{cosechador.documento}</td>
                <td className="p-2">
                  {cosechador.encargado || (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </td>
                <td className="p-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={encargadoSeleccionado}
                    onChange={(e) => setEncargadoSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {encargados.map((encargado) => (
                      <option key={encargado.id} value={encargado.id}>
                        {encargado.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="flex items-center gap-1 border rounded px-3 py-1 text-green-700 hover:bg-green-100 disabled:opacity-50"
                      onClick={() => handleAsignarEncargado(cosechador.id)}
                      disabled={!encargadoSeleccionado}
                    >
                      <UserPlus className="h-4 w-4" />
                      Asignar
                    </button>
                    <button
                      className="flex items-center gap-1 border rounded px-3 py-1 text-red-700 hover:bg-red-100 disabled:opacity-50"
                      onClick={() => handleQuitarEncargado(cosechador.id)}
                      disabled={!cosechador.encargadoId}
                    >
                      <UserMinus className="h-4 w-4" />
                      Quitar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cosechadoresFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  No se encontraron cosechadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}