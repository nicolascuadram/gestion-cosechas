"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Loader2, Upload } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documento: "",
    password: "",
    confirmPassword: "",
    empresa: "",
    region: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      region: e.target.value,
    })
  }

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFotoSeleccionada(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setFotoPreview(event.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/encargado/dashboard?registro=exitoso")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded shadow p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-green-700 text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </button>
          </Link>
          <div className="flex justify-center">
            <img src="/placeholder.svg?height=50&width=50" alt="Logo" className="h-12 w-12" />
          </div>
          <div className="w-20"></div>
        </div>
        <h2 className="text-2xl text-center font-bold mb-1">Registro de Jefe de Cuadrilla</h2>
        <p className="text-center text-gray-500 mb-6">
          Completa el formulario para crear tu cuenta como jefe de cuadrilla
        </p>
        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-green-500">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Upload className="h-8 w-8" />
                </div>
              )}
            </div>
            <label
              htmlFor="foto"
              className="cursor-pointer text-sm text-green-600 hover:text-green-700"
            >
              Subir foto (opcional)
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm mb-1">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm mb-1">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm mb-1">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="documento" className="block text-sm mb-1">Documento de identidad</label>
              <input
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="empresa" className="block text-sm mb-1">Empresa o Fundo</label>
            <input
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm mb-1">Región</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleSelectChange}
              required
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Selecciona una región</option>
              <option value="arica">Arica y Parinacota</option>
              <option value="tarapaca">Tarapacá</option>
              <option value="antofagasta">Antofagasta</option>
              <option value="atacama">Atacama</option>
              <option value="coquimbo">Coquimbo</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="ohiggins">O'Higgins</option>
              <option value="maule">Maule</option>
              <option value="nuble">Ñuble</option>
              <option value="biobio">Biobío</option>
              <option value="araucania">La Araucanía</option>
              <option value="losrios">Los Ríos</option>
              <option value="loslagos">Los Lagos</option>
              <option value="aysen">Aysén</option>
              <option value="magallanes">Magallanes</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm mb-1">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-1">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Completar registro"
            )}
          </button>
        </form>
        <p className="text-sm text-center w-full text-gray-400 mt-6">
          Al registrarte, aceptas nuestros términos y condiciones y política de privacidad.
        </p>
      </div>
    </div>
  )
}