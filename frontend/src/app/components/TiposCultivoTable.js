"use client"

import { useState, useEffect } from "react"
import { Edit, Trash, Leaf, Plus, X } from "lucide-react"

export default function TiposCultivoTable() {
  const [cultivos, setCultivos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  // Estados para el modal de agregar
  const [modalAgregar, setModalAgregar] = useState(false)
  const [nuevoCultivo, setNuevoCultivo] = useState({ 
    nombre: "", 
    descripcion: "", 
    precio_por_capacho: "" 
  })

  // Para modal eliminar
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: null, nombre: "" })

  // Para modal editar
  const [modalEditar, setModalEditar] = useState({ abierto: false, cultivo: null })

  const cargarCultivos = () => {
    fetch(`${API_URL}/administrador/getTipo_cosecha`)
      .then(res => res.json())
      .then(data => setCultivos(data))
      .catch(err => console.error("Error cargando cultivos", err))
  }

  useEffect(() => {
    cargarCultivos()
  }, [])

  const cultivosFiltrados = cultivos.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirModalAgregar = () => {
    setModalAgregar(true)
  }

  const cerrarModalAgregar = () => {
    setModalAgregar(false)
    setNuevoCultivo({ nombre: "", descripcion: "", precio_por_capacho: "" })
  }

  const handleChangeAgregar = (field, value) => {
    setNuevoCultivo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAgregar = async () => {
    if (!nuevoCultivo.nombre || !nuevoCultivo.precio_por_capacho) {
      return alert("Nombre y precio son obligatorios.")
    }

    try {
      const res = await fetch(`${API_URL}/administrador/getTipo_cosecha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoCultivo.nombre,
          descripcion: nuevoCultivo.descripcion,
          precio_por_capacho: parseInt(nuevoCultivo.precio_por_capacho),
        }),
      })

      if (res.ok) {
        cerrarModalAgregar()
        cargarCultivos()
      } else {
        const error = await res.json()
        alert("Error al agregar: " + error.error)
      }
    } catch (err) {
      console.error(err)
      alert("Error al conectar con el backend.")
    }
  }

  // Abrir modal eliminar
  const abrirModalEliminar = (id, nombre) => {
    setModalEliminar({ abierto: true, id, nombre })
  }

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    try {
      const res = await fetch(`${API_URL}/administrador/tipo_cosecha/${modalEliminar.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setModalEliminar({ abierto: false, id: null, nombre: "" })
        cargarCultivos()
      } else {
        alert("Error al eliminar")
      }
    } catch (err) {
      console.error(err)
      alert("Error al conectar con el backend.")
    }
  }

  // Abrir modal editar
  const abrirModalEditar = (cultivo) => {
    setModalEditar({ abierto: true, cultivo: { ...cultivo } }) // copia para editar
  }

  // Cambiar campos de edición
  const handleChangeEditar = (field, value) => {
    setModalEditar(prev => ({
      ...prev,
      cultivo: { ...prev.cultivo, [field]: value }
    }))
  }

  // Guardar edición
  const guardarEdicion = async () => {
    const { id, nombre, descripcion, precio_por_capacho } = modalEditar.cultivo
    if (!nombre || !precio_por_capacho) return alert("Nombre y precio son obligatorios.")

    try {
      const res = await fetch(`${API_URL}/administrador/tipo_cosecha/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio_por_capacho: parseInt(precio_por_capacho) }),
      })

      if (res.ok) {
        setModalEditar({ abierto: false, cultivo: null })
        cargarCultivos()
      } else {
        const error = await res.json()
        alert("Error al editar: " + error.message)
      }
    } catch (err) {
      console.error(err)
      alert("Error al conectar con el backend.")
    }
  }

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Gestión de Cultivos</h2>
          <p className="text-[#737373]">Agrega, edita o eliminar cultivos</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700 flex items-center justify-center gap-2"
          onClick={abrirModalAgregar}
        >
          <Plus className="h-4 w-4" />
          Agregar Cultivo
        </button>
      </div>
      <div className="flex justify-start items-start mb-4">
        <input
          className="border rounded-sm px-2 py-1 w-full md:w-1/3 outline-offset-1 outline-[#16a34a]"
          placeholder="Buscar cultivo..."
          value={busqueda}
          type="search"
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Vista de tabla para desktop */}
      <div className="hidden md:block">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Valor por Capacho (CLP)</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cultivosFiltrados.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2 flex items-center gap-2"><Leaf className="h-4 w-4 text-green-600" />{c.nombre}</td>
                <td className="p-2">${c.precio_por_capacho}</td>
                <td className="p-2 flex justify-end gap-2">
                  <button
                    className="p-1 hover:bg-gray-200 rounded-sm"
                    onClick={() => abrirModalEditar(c)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded-sm"
                    onClick={() => abrirModalEliminar(c.id, c.nombre)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-4">
        {cultivosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No hay cultivos registrados.</div>
        ) : (
          cultivosFiltrados.map(c => (
            <div key={c.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-bold text-lg">{c.nombre}</h3>
                    <p className="text-sm text-gray-600">ID: {c.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => abrirModalEditar(c)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => abrirModalEliminar(c.id, c.nombre)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Precio por capacho:</span>
                  <p className="text-lg font-bold text-green-600">${c.precio_por_capacho}</p>
                </div>
                {c.descripcion && (
                  <div>
                    <span className="font-medium text-gray-700">Descripción:</span>
                    <p className="text-sm">{c.descripcion}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Agregar */}
      {modalAgregar && (
       <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Agregar Nuevo Cultivo</h2>
              <button onClick={cerrarModalAgregar}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre*</label>
                <input
                  className="border px-2 py-1 w-full"
                  placeholder="Nombre del cultivo"
                  value={nuevoCultivo.nombre}
                  onChange={e => handleChangeAgregar("nombre", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <input
                  className="border px-2 py-1 w-full"
                  placeholder="Descripción opcional"
                  value={nuevoCultivo.descripcion}
                  onChange={e => handleChangeAgregar("descripcion", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Precio por Capacho*</label>
                <input
                  type="number"
                  className="border px-2 py-1 w-full"
                  placeholder="Precio en CLP"
                  value={nuevoCultivo.precio_por_capacho}
                  onChange={e => handleChangeAgregar("precio_por_capacho", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={cerrarModalAgregar}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleAgregar}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {modalEliminar.abierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>¿Estás seguro de eliminar el cultivo <strong>{modalEliminar.nombre}</strong>?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalEliminar({ abierto: false, id: null, nombre: "" })}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmarEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {modalEditar.abierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Editar Cultivo</h2>
              <button onClick={() => setModalEditar({ abierto: false, cultivo: null })}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              className="border px-2 py-1 w-full mb-2"
              placeholder="Nombre"
              value={modalEditar.cultivo.nombre}
              onChange={e => handleChangeEditar("nombre", e.target.value)}
            />
            <input
              className="border px-2 py-1 w-full mb-2"
              placeholder="Descripción"
              value={modalEditar.cultivo.descripcion}
              onChange={e => handleChangeEditar("descripcion", e.target.value)}
            />
            <input
              type="number"
              className="border px-2 py-1 w-full mb-4"
              placeholder="Precio por capacho"
              value={modalEditar.cultivo.precio_por_capacho}
              onChange={e => handleChangeEditar("precio_por_capacho", e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalEditar({ abierto: false, cultivo: null })}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={guardarEdicion}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}