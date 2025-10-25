"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    // Por ahora, redirigimos al dashboard
    router.push("/dashboard");
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

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Campo Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="habitat@gmail.com"
                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent"
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
                className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-transparent"
                required
              />
            </div>

            {/* Botón Iniciar sesión */}
            <button
              type="submit"
              className="w-full py-1.5 text-sm bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition-colors"
            >
              Iniciar sesión
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
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">V 1.0.1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
