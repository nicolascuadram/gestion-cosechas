"use client"

import { useState } from "react"
import { Edit, Trash, UserPlus } from "lucide-react"

const encargadosIniciales = [
  { id: 1, nombre: "Juan Pérez", email: "juan.perez@ejemplo.com", cosechadores: 8 },
  { id: 2, nombre: "María López", email: "maria.lopez@ejemplo.com", cosechadores: 12 },
  { id: 3, nombre: "Carlos Rodríguez", email: "carlos.rodriguez@ejemplo.com", cosechadores: 5 },
]

export default function EncargadosTable() {
  const [encargados, setEncargados] = useState(encargadosIniciales)
  const [nuevo, setNuevo] = useState({ nombre: "", email: "", password: "" })
  const [busqueda, setBusqueda] = useState("")

  const encargadosFiltrados = encargados.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <div className="flex justify-between mb-4">
        <input
          className="border rounded px-2 py-1 w-1/3"
          placeholder="Buscar encargado..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {/* Botón de ejemplo, puedes agregar modal para agregar */}
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <UserPlus className="h-4 w-4" />
          Agregar Encargado
        </button>
      </div>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Cosechadores</th>
            <th className="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {encargadosFiltrados.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.id}</td>
              <td className="p-2">{e.nombre}</td>
              <td className="p-2">{e.email}</td>
              <td className="p-2">{e.cosechadores}</td>
              <td className="p-2 flex justify-end gap-2">
                <button className="p-1 hover:bg-gray-200 rounded"><Edit className="h-4 w-4" /></button>
                <button className="p-1 hover:bg-gray-200 rounded"><Trash className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}