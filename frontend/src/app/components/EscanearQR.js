"use client"

import { useState } from "react"
import { QrCode } from "lucide-react"

export default function VistaCuadrilla() {
    const [cosechadores, setCosechadores] = useState(cosechadoresIniciales)
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState(null)

    // Filtrar cosechadores
    const cosechadoresFiltrados = cosechadores.filter((c) => {
        const cumpleBusqueda =
            c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.documento.includes(busqueda)
        const cumpleFiltroEstado = filtroEstado === null || c.estado === filtroEstado
        return cumpleBusqueda && cumpleFiltroEstado
    })

    return (
        <section className="bg-white rounded shadow p-6">
            <header className="mb-6">
                <h2 className="text-2xl font-bold">Escaneo de Capachos</h2>
                <p className="text-gray-500">Escanea el código QR de cada capacho lleno para registrar la entrega</p>
            </header>
            <main className="flex flex-col justify-start items-center gap-4 w-full">
                <div className="flex justify-center items-start w-full">
                    <div className="p-4 bg-gray-50 rounded-full">
                        <QrCode color="#333" size={48} />
                    </div>
                </div>
                <div className="flex justify-center items-start w-full">
                    <p className="text-gray-500 text-center text-base font-medium">
                        Presiona el botón para iniciar el escaneo del código QR del capacho
                    </p>
                </div>
                <div className="flex justify-center items-start w-full">
                    <button className="px-4 py-2 w-full">
                        Iniciar Escaneo
                    </button>
                </div>
            </main>
        </section>
    )
}