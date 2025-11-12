"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenService } from "@/utils/token.service";

interface DashboardGuardProps {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Verificar si hay token
      if (!tokenService.hasToken()) {
        router.push("/");
        return;
      }

      // Verificar si tiene compañía asignada
      if (!tokenService.hasCompany()) {
        // Redirigir a la página de sin compañía
        router.push("/sin-compania");
        return;
      }

      // Todo está bien
      setIsChecking(false);
    };

    checkAccess();
  }, [router, pathname]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
}

