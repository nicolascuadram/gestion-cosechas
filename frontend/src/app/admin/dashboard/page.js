"use client"

import { useState } from "react"
import AdminSidebar from "@/app/components/Sidebar"
import TiposCultivoTable from "@/app/components/TiposCultivoTable"
import EncargadosTable from "@/app/components/EncargadosTable"
import AsignacionCosechadores from "@/app/components/AsignacionCosechadores"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("cultivos")
  return (
    <div className="flex min-h-screen">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 bg-gray-50">
        {activeTab === "encargados" && <EncargadosTable />}
        {activeTab === "cultivos" && <TiposCultivoTable />}
        {activeTab === "asignacion" && <AsignacionCosechadores />}
        {/* Puedes agregar más vistas aquí según el tab */}
      </main>
    </div>
  )
}