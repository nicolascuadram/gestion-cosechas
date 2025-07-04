"use client"

import { useState } from "react"
import SidebarJefeCuadrilla from "@/app/components/SidebarJefeCuadrilla"
import VistaCuadrilla from "@/app/components/VistaCuadrilla"
import EscanearQR from "@/app/components/EscanearQR"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("cuadrilla")
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarJefeCuadrilla activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 md:ml-64 ml-0 pt-16 md:pt-8">
        {activeTab === "cuadrilla" && <VistaCuadrilla />}
        {activeTab === "escaneo" && <EscanearQR />}
        {/* Puedes agregar más vistas aquí según el tab */}
      </main>
    </div>
  )
}