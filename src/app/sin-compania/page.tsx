"use client";

import { useRouter } from "next/navigation";
import { tokenService } from "@/utils/token.service";

export default function SinCompaniaPage() {
  const router = useRouter();

  const handleLogout = () => {
    tokenService.clearToken();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-yellow-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso restringido
        </h1>
        <p className="text-gray-600 mb-6">
          No tienes una compañía asignada. Comunícate con el desarrollador para obtener acceso.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

