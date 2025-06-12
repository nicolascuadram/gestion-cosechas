"use client"

import { Users, FileText, Leaf, UserPlus, BarChart3, Home, LogOut } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { id: "encargados", label: "Encargados", icon: <Users className="h-5 w-5" /> },
  { id: "reportes", label: "Reportes", icon: <FileText className="h-5 w-5" /> },
  { id: "cultivos", label: "Tipos de Cultivo", icon: <Leaf className="h-5 w-5" /> },
  { id: "asignacion", label: "Asignación", icon: <UserPlus className="h-5 w-5" /> },
  { id: "estadisticas", label: "Estadísticas", icon: <BarChart3 className="h-5 w-5" /> },
]

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-600">SisGeCo</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-sm ${activeTab === item.id ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link href="/">
          <button className="w-full flex items-center justify-center border rounded-sm px-4 py-2 gap-2 hover:bg-gray-100">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </Link>
      </div>
    </div>
  )
}