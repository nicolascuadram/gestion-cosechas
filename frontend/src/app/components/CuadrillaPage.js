"use client"

import { useEffect, useState } from "react"
import { Edit, Trash, UserPlus, Users } from "lucide-react"

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

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:8080/cuadrillas")
      .then(res => res.json())
      .then(setCuadrillas)
    fetch("http://localhost:8080/encargados")
      .then(res => res.json())
      .then(setEncargados)
    fetch("http://localhost:8080/cosechadores")
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
        ? `http://localhost:8080/cuadrillas/${editCuadrilla.id}`
        : "http://localhost:8080/cuadrillas"
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
      fetch("http://localhost:8080/cuadrillas")
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
    await fetch(`http://localhost:8080/cuadrillas/${id}`, { method: "DELETE" })
    setCuadrillas(cuadrillas.filter(c => c.id !== id))
  }

  // Asignar cosechador a cuadrilla
  const handleAsignarCosechador = async () => {
    if (!cosechadorSeleccionado) return
    await fetch(`http://localhost:8080/cosechadores/${cosechadorSeleccionado}/asignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuadrillaId: asignarId }),
    })
    // Refrescar cosechadores
    fetch("http://localhost:8080/cosechadores")
      .then(res => res.json())
      .then(setCosechadores)
    setCosechadorSeleccionado("")
    setAsignarId(null)
  }

  // Quitar cosechador de cuadrilla
  const handleQuitarCosechador = async (cosechadorId) => {
    await fetch(`http://localhost:8080/cosechadores/${cosechadorId}/asignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuadrillaId: null }),
    })
    fetch("http://localhost:8080/cosechadores")
      .then(res => res.json())
      .then(setCosechadores)
  }

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Users className="h-6 w-6" /> Gestión de Cuadrillas</h2>
          <p className="text-[#737373]">Crea, edita y asigna cosechadores a cuadrillas</p>
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => { setModalOpen(true); setEditCuadrilla(null); setForm({ nombre: "", encargadoId: "" }) }}
        >
          <UserPlus className="h-4 w-4" />
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
                  {cosechadores.filter(co => co.cuadrillaId === c.id).map(co =>
                    <li key={co.id} className="flex items-center gap-2 text-sm">
                      {co.nombre}
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => handleQuitarCosechador(co.id)}
                      >Quitar</button>
                    </li>
                  )}
                  {cosechadores.filter(co => co.cuadrillaId === c.id).length === 0 && (
                    <li className="text-xs text-gray-400">Sin cosechadores</li>
                  )}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
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
                    // Verifica si el encargado ya tiene una cuadrilla asignada
                    const tieneCuadrilla = cuadrillas.some(c => c.id_encargado === e.id)
                    // Si está editando y el encargado es el actual, debe poder seleccionarlo
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Asignar Cosechador</h3>
            <select
              className="border rounded px-3 py-2 w-full mb-4"
              value={cosechadorSeleccionado}
              onChange={e => setCosechadorSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un cosechador</option>
              {cosechadores.filter(c => !c.cuadrillaId).map(c => (
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
    </div>
    )
}