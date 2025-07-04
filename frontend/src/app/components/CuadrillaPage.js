"use client"

import { useEffect, useState } from "react"
import { Edit, Trash, Plus, Users, X } from "lucide-react"

export default function CuadrillaPage() {
  const [cuadrillas, setCuadrillas] = useState([])
  const [encargados, setEncargados] = useState([])
  const [cosechadores, setCosechadores] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editCuadrilla, setEditCuadrilla] = useState(null)
  const [form, setForm] = useState({ nombre: "", encargadoId: "" })
  const [asignarId, setAsignarId] = useState(null)
  const [cosechadorSeleccionado, setCosechadorSeleccionado] = useState("")
  const [error, setError] = useState("")
  const [mostrarCosechadoresId, setMostrarCosechadoresId] = useState(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Fetch data
  useEffect(() => {
    fetch(`${API_URL}/cuadrillas`)
      .then(res => res.json())
      .then(setCuadrillas)
    fetch(`${API_URL}/encargados`)
      .then(res => res.json())
      .then(setEncargados)
    fetch(`${API_URL}/cosechadores`)
      .then(res => res.json())
      .then(setCosechadores)
  }, [])

  // Crear o editar cuadrilla
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!form.nombre || !form.encargadoId) {
      setError("Nombre y encargado son obligatorios")
      return
    }
    try {
      const method = editCuadrilla ? "PUT" : "POST"
      const url = editCuadrilla
        ? `${API_URL}/cuadrillas/${editCuadrilla.id}`
        : `${API_URL}/cuadrillas`
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, encargadoId: form.encargadoId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || "Error al guardar cuadrilla")
        return
      }
      // Refrescar cuadrillas
      fetch(`${API_URL}/cuadrillas`)
        .then(res => res.json())
        .then(setCuadrillas)
      setModalOpen(false)
      setEditCuadrilla(null)
      setForm({ nombre: "", encargadoId: "" })
    } catch {
      setError("Error de conexión")
    }
  }

  // Eliminar cuadrilla
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar cuadrilla?")) return
    await fetch(`${API_URL}/cuadrillas/${id}`, { method: "DELETE" })
    setCuadrillas(cuadrillas.filter(c => c.id !== id))
  }

  // Asignar cosechador a cuadrilla
  const handleAsignarCosechador = async () => {
    if (!cosechadorSeleccionado) return
    await fetch(`${API_URL}/cosechadores/${cosechadorSeleccionado}/asignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cuadrilla: asignarId }),
    })
    // Refrescar cosechadores
    fetch(`${API_URL}/cosechadores`)
      .then(res => res.json())
      .then(setCosechadores)
    setCosechadorSeleccionado("")
    setAsignarId(null)
  }

  // Quitar cosechador de cuadrilla
  const handleQuitarCosechador = async (cosechadorId) => {
    await fetch(`${API_URL}/cosechadores/${cosechadorId}/asignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cuadrilla: null }),
    });
    fetch(`${API_URL}/cosechadores`)
      .then(res => res.json())
      .then(setCosechadores)
  }

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Gestión de Cuadrillas</h2>
          <p className="text-[#737373]">Crea, edita y asigna cosechadores a cuadrillas</p>
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => { setModalOpen(true); setEditCuadrilla(null); setForm({ nombre: "", encargadoId: "" }) }}
        >
          <Plus className="h-4 w-4" />
          Nueva Cuadrilla
        </button>
      </div>

      {/* Nuevo diseño: tarjetas para cuadrillas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cuadrillas.map(c => (
          <div key={c.id} className="border rounded-lg shadow-sm p-5 bg-gray-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-mono">ID: {c.id}</span>
                <div className="flex gap-1">
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => {
                      setEditCuadrilla(c)
                      setForm({ nombre: c.nombre, encargadoId: c.id_encargado })
                      setModalOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1">{c.nombre}</h3>
              <div className="mb-2">
                <span className="text-sm text-gray-600 font-semibold">Encargado: </span>
                <span className="text-sm">
                  {encargados.find(e => e.id === c.id_encargado)?.nombre || "Sin asignar"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600 font-semibold">Cosechadores:</span>
                <ul className="list-disc ml-5 mt-1 mb-2">
                  {(() => {
                    const cosechadoresCuadrilla = cosechadores.filter(co => co.id_cuadrilla === c.id)
                    const cosechadoresVisibles = cosechadoresCuadrilla.slice(0, 5)
                    const hayMas = cosechadoresCuadrilla.length > 5
                    
                    return (
                      <>
                        {cosechadoresVisibles.map(co =>
                          <li key={co.id} className="flex items-center gap-2 text-sm">
                            {co.nombre}
                            <button
                              className="text-xs text-red-600 hover:underline"
                              onClick={() => handleQuitarCosechador(co.id)}
                            >Quitar</button>
                          </li>
                        )}
                        {cosechadoresCuadrilla.length === 0 && (
                          <li className="text-xs text-gray-400">Sin cosechadores</li>
                        )}
                        {hayMas && (
                          <li className="text-sm">
                            <button
                              className="text-blue-600 hover:underline font-medium"
                              onClick={() => setMostrarCosechadoresId(c.id)}
                            >
                              Mostrar más ({cosechadoresCuadrilla.length - 5} más)
                            </button>
                          </li>
                        )}
                      </>
                    )
                  })()}
                </ul>
                <button
                  className="text-xs text-green-600 hover:underline mt-1"
                  onClick={() => setAsignarId(c.id)}
                >Asignar cosechador</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear/editar cuadrilla */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editCuadrilla ? "Editar Cuadrilla" : "Nueva Cuadrilla"}</h3>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Encargado</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={form.encargadoId}
                  onChange={e => setForm(f => ({ ...f, encargadoId: e.target.value }))}
                  required
                >
                  <option value="">Selecciona un encargado</option>
                  {encargados.map(e => {
                    const tieneCuadrilla = cuadrillas.some(c => c.id_encargado === e.id)
                    const esActual = editCuadrilla && editCuadrilla.id_encargado === e.id
                    return (
                      <option
                        key={e.id}
                        value={e.id}
                        disabled={tieneCuadrilla && !esActual}
                        style={tieneCuadrilla && !esActual ? { opacity: 0.5 } : {}}
                      >
                        {e.nombre} {e.p_apellido}
                        {tieneCuadrilla && !esActual ? " (Ya asignado)" : ""}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-3 py-1 rounded bg-gray-200" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white">{editCuadrilla ? "Guardar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal asignar cosechador */}
      {asignarId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Asignar Cosechador</h3>
            <select
              className="border rounded px-3 py-2 w-full mb-4"
              value={cosechadorSeleccionado}
              onChange={e => setCosechadorSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un cosechador</option>
              {cosechadores.filter(c => !c.id_cuadrilla).map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setAsignarId(null)}>Cancelar</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={handleAsignarCosechador}>Asignar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal mostrar todos los cosechadores */}
      {mostrarCosechadoresId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Cosechadores de {cuadrillas.find(c => c.id === mostrarCosechadoresId)?.nombre}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarCosechadoresId(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {cosechadores
                .filter(co => co.id_cuadrilla === mostrarCosechadoresId)
                .map(co => (
                  <div key={co.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{co.nombre} {co.p_apellido}</div>
                      <div className="text-sm text-gray-600">RUT: {co.rut}</div>
                    </div>
                    <button
                      className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                      onClick={() => {
                        handleQuitarCosechador(co.id)
                        // Si ya no hay cosechadores, cerrar el modal
                        const cosechadoresRestantes = cosechadores.filter(c => c.id_cuadrilla === mostrarCosechadoresId && c.id !== co.id)
                        if (cosechadoresRestantes.length === 0) {
                          setMostrarCosechadoresId(null)
                        }
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              {cosechadores.filter(co => co.id_cuadrilla === mostrarCosechadoresId).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No hay cosechadores asignados a esta cuadrilla
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  setAsignarId(mostrarCosechadoresId)
                  setMostrarCosechadoresId(null)
                }}
              >
                Asignar cosechador
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setMostrarCosechadoresId(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}
