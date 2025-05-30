"use client"

import { useState } from "react"
import JefeCuadrillaSidebar from "@/app/components/SidebarJefeCuadrilla"
import VistaCuadrilla from "@/app/components/VistaCuadrilla"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("cultivos")
  return (
    <div className="flex min-h-screen">
      <JefeCuadrillaSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 bg-gray-50">
        {activeTab === "cuadrilla" && <VistaCuadrilla />}
        {/* Puedes agregar más vistas aquí según el tab */}
      </main>
    </div>
  )
}