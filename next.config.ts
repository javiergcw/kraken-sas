import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // El puerto se configura mediante la variable de entorno PORT
  // Por defecto Next.js usa 3000, pero Docker usará PORT=4001
};

export default nextConfig;
