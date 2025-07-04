// File: AdminDashboard.js
"use client";

import { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import EncargadosTable from "./EncargadosTable";
import CuadrillaPage from "./CuadrillaPage";
import AsignacionCosechadores from "./AsignacionCosechadores";
import TiposCultivoTable from "./TiposCultivoTable";
import ReportesTable from "./ReportesTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("encargados");

  const renderContent = () => {
    switch (activeTab) {
      case "encargados":
        return <EncargadosTable />;
      case "cuadrillas":
        return <CuadrillaPage />;
      case "asignacion":
        return <AsignacionCosechadores />;
      case "cultivos":
        return <TiposCultivoTable />;
      case "reportes":
        return <ReportesTable />;
      case "estadisticas":
        return <div>Estadísticas (por implementar)</div>;
      default:
        return <EncargadosTable />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6 bg-gray-100">{renderContent()}</div>
    </div>
  );
}