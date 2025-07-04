// File: ReportesTable.js
"use client";

import { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";

export default function ReportesTable() {
  const [reportes, setReportes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/administrador/reportes")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reportes");
        return res.json();
      })
      .then((data) => {
        setReportes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const reportesFiltrados = reportes.filter(
    (r) =>
      r.nombre_cosechador.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.nombre_cuadrilla.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.nombre_cultivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-600" />
            Reportes de Entregas
          </h2>
          <p className="text-[#737373]">
            Visualiza el rendimiento y actividad de las entregas
          </p>
        </div>
      </div>
      <div className="flex justify-start items-start mb-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="border rounded-sm px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Buscar por cosechador, cuadrilla o cultivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            type="search"
          />
        </div>
      </div>
      
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-[#737373] font-medium">ID Registro</th>
              <th className="p-2 text-[#737373] font-medium">Cosechador</th>
              <th className="p-2 text-[#737373] font-medium">Cuadrilla</th>
              <th className="p-2 text-[#737373] font-medium">Cultivo</th>
              <th className="p-2 text-[#737373] font-medium">Fecha</th>
              <th className="p-2 text-[#737373] font-medium">Capachos</th>
              <th className="p-2 text-[#737373] font-medium">Valor Total (CLP)</th>
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-400">
                  No hay reportes registrados.
                </td>
              </tr>
            ) : (
              reportesFiltrados.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.nombre_cosechador}</td>
                  <td className="p-2">{r.nombre_cuadrilla}</td>
                  <td className="p-2">{r.nombre_cultivo}</td>
                  <td className="p-2">{new Date(r.fecha).toLocaleDateString()}</td>
                  <td className="p-2">{r.cantidad_capachos}</td>
                  <td className="p-2">
                    ${(r.cantidad_capachos * r.precio_por_capacho).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-4">
        {reportesFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No hay reportes registrados.</div>
        ) : (
          reportesFiltrados.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{r.nombre_cosechador}</h3>
                  <p className="text-sm text-gray-600">ID: {r.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${(r.cantidad_capachos * r.precio_por_capacho).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{r.cantidad_capachos} capachos</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Cuadrilla:</span>
                  <p className="text-sm">{r.nombre_cuadrilla}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cultivo:</span>
                  <p className="text-sm">{r.nombre_cultivo}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fecha:</span>
                  <p className="text-sm">{new Date(r.fecha).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}