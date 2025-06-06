"use client"

import { useState } from "react"
import { Edit, Trash, Leaf, Plus } from "lucide-react"

const cultivosIniciales = [
  { id: 1, nombre: "Manzana", valor: 500 },
  { id: 2, nombre: "Guinda", valor: 700 },
  { id: 3, nombre: "Kiwi", valor: 600 },
]

export default function TiposCultivoTable() {
  const [cultivos, setCultivos] = useState(cultivosIniciales)
  const [busqueda, setBusqueda] = useState("")

  const cultivosFiltrados = cultivos.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="bg-white rounded shadow p-6 w-full">
      <div className="flex justify-between mb-4">
        <input
          className="border rounded px-2 py-1 w-1/3"
          placeholder="Buscar cultivo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {/* Botón de ejemplo, puedes agregar modal para agregar */}
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Agregar Cultivo
        </button>
      </div>
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
              <td className="p-2">${c.valor}</td>
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