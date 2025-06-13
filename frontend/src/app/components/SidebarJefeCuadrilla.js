"use client"

import { Users, FileText, Leaf, UserPlus, BarChart3, Home, LogOut } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { id: "cuadrilla", label: "Mi Cuadrilla", icon: <Users className="h-5 w-5" /> },
  { id: "gestion", label: "Gestión", icon: <FileText className="h-5 w-5" /> },
  { id: "escaneo", label: "Escanear QR", icon: <Leaf className="h-5 w-5" /> },
]

export default function SidebarJefeCuadrilla({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="w-full border-b border-gray-200">
        <Link href="/jefeCuadrilla/dashboard">
          <div className="flex justify-center items-center w-full h-[60px]">
            <Home className="h-6 w-6 text-principal" />
            <span className="px-2 text-xl font-bold text-transparent italic bg-clip-text bg-linear-to-r from-principal to-lime-400">Agrogestor Digital</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-sm cursor-pointer ${activeTab === item.id ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}
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