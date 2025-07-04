"use client"

import { Users, FileText, Leaf, Sprout, UserPlus, BarChart3, Home, LogOut, FileUser, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const menuItems = [
  { id: "encargados", label: "Encargados", icon: <Users className="h-5 w-5" /> },
  { id: "cuadrillas", label: "Cuadrillas", icon: <FileUser className="h-5 w-5" /> },
  { id: "asignacion", label: "Asignación", icon: <UserPlus className="h-5 w-5" /> },
  { id: "cultivos", label: "Tipos de Cultivo", icon: <Sprout className="h-5 w-5" /> },
  { id: "cosecha", label: "Cosecha", icon: <Leaf className="h-5 w-5" /> },
  { id: "reportes", label: "Reportes", icon: <FileText className="h-5 w-5" /> },
  { id: "estadisticas", label: "Estadísticas", icon: <BarChart3 className="h-5 w-5" /> },
]

export default function SidebarAdmin({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Cerrar sidebar cuando se hace clic fuera en dispositivos móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevenir scroll del body cuando el sidebar está abierto en móviles
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="w-full border-b border-gray-200">
          <Link href="/admin/dashboard">
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
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-sm cursor-pointer ${activeTab === item.id ? "bg-principal text-white" : "hover:bg-gray-100"}`}
              onClick={() => {
                setActiveTab(item.id)
                setIsOpen(false) // Cerrar sidebar en móviles al seleccionar una opción
              }}
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
    </>
  )
}