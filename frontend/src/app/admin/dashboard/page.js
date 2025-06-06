"use client"

import { useState } from "react"
import AdminSidebar from "@/app/components/Sidebar"
import TiposCultivoTable from "@/app/components/TiposCultivoTable"
import EncargadosTable from "@/app/components/EncargadosTable"
import AsignacionCosechadores from "@/app/components/AsignacionCosechadores"
import { User, Bell } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("cultivos")
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-full gap-2">
        <div className="flex justify-end items-center bg-white w-full h-[61px] px-4 gap-2 border-b border-gray-200">
          <span className="p-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer"><Bell color="#333" size={18}/></span>
          <span className="p-2 hover:bg-gray-200 rounded-md transition-all cursor-pointer"><User color="#333" size={18}/></span>
        </div>
        <section className="p-8">
          {activeTab === "encargados" && <EncargadosTable />}
          {activeTab === "cultivos" && <TiposCultivoTable />}
          {activeTab === "asignacion" && <AsignacionCosechadores />}
          {/* Puedes agregar más vistas aquí según el tab */}
        </section>
      </main>
    </div>
  )
}