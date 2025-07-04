"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Pruebas rápidas
    if (email === "admin@cosecha.com" && password === "admin") {
      setLoading(false)
      router.push("/admin/dashboard")
      return
    }
    if (email === "encargado@cosecha.com" && password === "encargado") {
      setLoading(false)
      router.push("/jefeCuadrilla/dashboard")
      return
    }

    // Login real
    try {
      console.log("Iniciando sesión con:", { email, password })
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || "Error de autenticación")
        setLoading(false)
        return
      }
      const data = await res.json()
      // Guarda la sesión (puedes usar localStorage, cookies, o context)
      localStorage.setItem("user", JSON.stringify(data.user))
      // Redirige según tipo
      if (data.tipo === "encargado") {
        router.push("/jefeCuadrilla/dashboard")
      } else {
        // Por si agregas otros tipos en el futuro
        router.push("/")
      }
    } catch {
      setError("Error de conexión")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="bg-white rounded-sm shadow-md p-8 w-full max-w-md border border-[#e2e2e2]">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Logo" className="h-20 w-20 mb-2 rounded-full" />
          <h1 className="text-4xl w-full py-2 font-bold text-transparent italic text-center bg-clip-text bg-linear-to-r from-[#16a34a] to-lime-400">
            AgroGestor Digital
          </h1>
          <p className="text-gray-500 text-center">Ingresa tus credenciales para acceder al sistema</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#333] font-medium mb-1">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-[#333] font-medium mb-1">Contraseña:</label>
            <input
              id="password"
              type="password"
              className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-sm flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">¿Eres jefe de cuadrilla y no tienes cuenta?</p>
          <Link href="/registro-encargado">
            <button className="w-full border rounded-sm py-2 mt-1 hover:bg-gray-100 font-medium">
              Registrarse como Jefe de Cuadrilla
            </button>
          </Link>
        </div>
        <div className="text-xs text-center text-gray-400 mt-6">
          <p>Credenciales de prueba:</p>
          <p>Admin: admin@cosecha.com / admin</p>
          <p>Encargado: encargado@cosecha.com / encargado</p>
        </div>
      </div>
    </div>
  )
}