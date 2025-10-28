"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { healthCheckController, authController } from "@/components/core";
import { tokenService } from "@/utils/token.service";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si ya hay token, redirigir al dashboard
    if (tokenService.hasToken() && tokenService.hasCompany()) {
      router.push("/dashboard");
      return;
    }

    // Obtener la versión del sistema mediante el controlador
    const fetchVersion = async () => {
      const systemVersion = await healthCheckController.getVersion();
      setVersion(systemVersion);
    };

    fetchVersion();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authController.login({ email, password });
      
      if (response && response.success) {
        // Verificar si tiene compañía asignada
        if (response.data.User.company_id === null) {
          setError("No tienes una compañía asignada. Comunícate con el desarrollador.");
          authController.logout(); // Limpiar el token ya que no puede acceder
          return;
        }

        // Redirigir al dashboard si el login es exitoso y tiene compañía
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      
      // Mensajes de error más específicos
      if (error?.status === 404) {
        setError("Endpoint no encontrado. Verifica la URL del servidor.");
      } else if (error?.status === 401 || error?.status === 403) {
        setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
      } else if (error?.status === 400) {
        // Errores de validación o formato
        const errorMessage = error?.data?.message || "Datos inválidos. Por favor, verifica la información.";
        setError(errorMessage);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo - Negro */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-end p-12">
      </div>

      {/* Panel derecho - Formulario de login */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-14 h-14">
              <path fill="#6200EA" d="M30 20v20l-20 20v20h20v20h40V80h20V60l-20-20V20H30zm10 30h20v20H40V50z"/>
            </svg>
          </div>

          {/* Título */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Iniciar sesión
            </h1>
            <p className="text-sm text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Campo Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@scubaworld.com"
                disabled={isLoading}
                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Botón Iniciar sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-1.5 text-sm bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            {/* Botón Iniciar con Email */}
            <button
              type="button"
              className="w-full py-1.5 text-sm bg-white text-gray-900 border border-gray-200 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Iniciar con Email
            </button>
          </form>

          {/* Términos y condiciones */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Al ingresar en nuestros sistemas, aceptas nuestro{" "}
              <a href="#" className="text-gray-900 underline hover:text-purple-600">
                Términos y condiciones
              </a>{" "}
              y{" "}
              <a href="#" className="text-gray-900 underline hover:text-purple-600">
                Políticas y privacidad
              </a>
            </p>
          </div>

          {/* Versión */}
          {version && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">V {version}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
