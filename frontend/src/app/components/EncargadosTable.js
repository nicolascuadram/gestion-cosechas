"use client"

import { useEffect, useState } from "react"
import { Edit, Trash, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EncargadosTable() {
  const [encargados, setEncargados] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [editEncargado, setEditEncargado] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editError, setEditError] = useState("")
  const [deleteId, setDeleteId] = useState(null)
  const [deleteError, setDeleteError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:8080/encargados")
      .then(res => res.json())
      .then(data => setEncargados(data))
      .catch(() => setEncargados([]))
  }, [])

  const encargadosFiltrados = encargados.filter(
    (e) =>
      (e.nombre && e.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (e.email && e.email.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Gestión de Encargados de Cuadrilla</h2>
          <p className="text-[#737373]">Agrega, edita o elimina encargados de cuadrilla</p>
        </div>
        {/* Botón de ejemplo, puedes agregar modal para agregar */}
        <button
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700"
          onClick={() => router.push("/registro-encargado")}
        >
          <UserPlus className="h-4 w-4" />
          Agregar Encargado
        </button>
      </div>
      <div className="flex justify-start items-start mb-4">
        <input
          className="border rounded-sm px-2 py-1 w-full md:w-1/3 outline-offset-1 outline-[#16a34a]"
          placeholder="Buscar encargado..."
          value={busqueda}
          type="search"
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>
      
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="font-light border-b">
              <th className="p-2 text-[#737373] font-medium">ID</th>
              <th className="p-2 text-[#737373] font-medium">Nombre</th>
              <th className="p-2 text-[#737373] font-medium">Email</th>
              <th className="p-2 text-[#737373] font-medium">Teléfono</th>
              <th className="p-2 text-[#737373] font-medium">Empresa</th>
              <th className="p-2 text-[#737373] font-medium">Región</th>
              <th className="p-2 text-right text-[#737373] font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {encargadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">No hay encargados registrados.</td>
              </tr>
            ) : (
              encargadosFiltrados.map(e => (
                <tr key={e.id} className="border-b">
                  <td className="p-2">{e.id}</td>
                  <td className="p-2">{e.nombre} {e.p_apellido}</td>
                  <td className="p-2">{e.email}</td>
                  <td className="p-2">{e.telefono}</td>
                  <td className="p-2">{e.empresa}</td>
                  <td className="p-2">{e.region}</td>
                  <td className="p-2 flex justify-end gap-2">
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => {
                        setEditEncargado(e)
                        setEditForm(e)
                        setEditError("")
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() => {
                        setDeleteId(e.id)
                        setDeleteError("")
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-4">
        {encargadosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No hay encargados registrados.</div>
        ) : (
          encargadosFiltrados.map(e => (
            <div key={e.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{e.nombre} {e.p_apellido}</h3>
                  <p className="text-sm text-gray-600">ID: {e.id}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => {
                      setEditEncargado(e)
                      setEditForm(e)
                      setEditError("")
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => {
                      setDeleteId(e.id)
                      setDeleteError("")
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-sm">{e.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <p className="text-sm">{e.telefono}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Empresa:</span>
                  <p className="text-sm">{e.empresa}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Región:</span>
                  <p className="text-sm">{e.region}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición */}
      {editEncargado && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Editar Encargado</h3>
            {editError && <div className="text-red-600 mb-2">{editError}</div>}
            <form
              onSubmit={async (ev) => {
                ev.preventDefault()
                setEditError("")
                try {
                  const res = await fetch(`http://localhost:8080/encargados/${editEncargado.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editForm),
                  })
                  if (!res.ok) {
                    const data = await res.json()
                    setEditError(data.message || "Error al actualizar encargado")
                    return
                  }
                  const updated = await res.json()
                  setEncargados(encargados.map(e => e.id === updated.id ? updated : e))
                  setEditEncargado(null)
                } catch {
                  setEditError("Error de conexión")
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.nombre || ""} onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Apellido</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.p_apellido || ""} onChange={e => setEditForm(f => ({ ...f, p_apellido: e.target.value }))} placeholder="Apellido" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.email || ""} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.telefono || ""} onChange={e => setEditForm(f => ({ ...f, telefono: e.target.value }))} placeholder="Teléfono" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RUT</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.rut || ""} onChange={e => setEditForm(f => ({ ...f, rut: e.target.value }))} placeholder="RUT" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Empresa</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.empresa || ""} onChange={e => setEditForm(f => ({ ...f, empresa: e.target.value }))} placeholder="Empresa" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Región</label>
                <input className="border rounded px-2 py-1 w-full" value={editForm.region || ""} onChange={e => setEditForm(f => ({ ...f, region: e.target.value }))} placeholder="Región" required />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 order-2 sm:order-1" onClick={() => setEditEncargado(null)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white order-1 sm:order-2">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">¿Eliminar encargado?</h3>
            {deleteError && <div className="text-red-600 mb-2">{deleteError}</div>}
            <p className="mb-4">¿Estás seguro que deseas eliminar este encargado? Esta acción no se puede deshacer.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 order-2 sm:order-1"
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white order-1 sm:order-2"
                onClick={async () => {
                  setDeleteError("")
                  try {
                    const res = await fetch(`http://localhost:8080/encargados/${deleteId}`, {
                      method: "DELETE"
                    })
                    if (res.status === 204) {
                      setEncargados(encargados.filter(e => e.id !== deleteId))
                      setDeleteId(null)
                    } else {
                      const data = await res.json()
                      setDeleteError(data.message || "No se pudo eliminar")
                    }
                  } catch {
                    setDeleteError("Error de conexión")
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}