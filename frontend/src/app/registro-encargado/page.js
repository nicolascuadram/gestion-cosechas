"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    p_apellido: "",
    email: "",
    telefono: "",
    rut: "",
    password: "",
    confirmPassword: "",
    empresa: "",
    region: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/encargados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrar encargado");
      } else {
        setSuccess(true);
        setFormData({
          nombre: "",
          p_apellido: "",
          email: "",
          telefono: "",
          rut: "",
          password: "",
          confirmPassword: "",
          empresa: "",
          region: "",
        });
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-sm shadow-sm p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <Link href="/">
            <button className="flex items-center text-gray-600 hover:text-green-700 text-sm" onClick={() => router.back()}>
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
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-sm mb-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex flex-col items-center gap-2 bg-green-100 text-green-700 px-4 py-4 rounded mb-4 transition-all">
            <svg className="h-8 w-8 text-green-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-lg font-semibold text-center">¡Registro exitoso!</span>
            <span className="text-center">El encargado fue creado correctamente.</span>
            <button
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              onClick={() => setSuccess(false)}
              aria-label="Cerrar"
              type="button"
            >
              Registrar otro encargado
            </button>
          </div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <label htmlFor="p_apellido" className="block text-sm mb-1">Apellido</label>
                <input
                  id="p_apellido"
                  name="p_apellido"
                  value={formData.p_apellido}
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
                className="border rounded-sm px-3 py-2 w-full"
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
                <label htmlFor="rut" className="block text-sm mb-1">Documento de identidad</label>
                <input
                  id="rut"
                  name="rut"
                  value={formData.rut}
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
                className="border rounded-sm px-3 py-2 w-full"
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
        )}
        <p className="text-sm text-center w-full text-gray-400 mt-6">
          Al registrarte, aceptas nuestros términos y condiciones y política de privacidad.
        </p>
      </div>
    </div>
  )
}