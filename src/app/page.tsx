"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
    if (tokenService.hasToken() && tokenService.hasCompany()) {
      router.push("/dashboard");
      return;
    }

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

      if (response?.success) {
        if (response.data.User.company_id === null) {
          router.push("/sin-compania");
          return;
        }
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas.");
      }
    } catch (error: any) {
      setError("Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        backgroundColor: "#ffffff",
      }}
    >
      {/* PANEL IMAGEN */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          component="img"
          src="/Buceadores Snorkel Bajo El Agua.jpg"
          alt="Buceadores"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
  
      {/* PANEL LOGIN */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",      // CENTRADO VERTICAL
          justifyContent: "center",  // CENTRADO HORIZONTAL
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            textAlign: "center",
          }}
        >
          {/* TÍTULO */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111",
              mb: 1,
            }}
          >
            Bienvenido
          </Typography>
  
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mb: 3,
            }}
          >
            Ingresa tus credenciales para continuar
          </Typography>
  
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
  
          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
  
            <TextField
              fullWidth
              size="small"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
  
            <Button
              type="submit"
              disabled={isLoading}
              sx={{
                mt: 1,
                height: 40,
                backgroundColor: "#111",
                color: "#fff",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#000",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </Box>
  
          {/* FOOTER */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 3,
              color: "#999",
            }}
          >
            Al ingresar aceptas nuestros términos y condiciones
          </Typography>
  
          {version && (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "#bbb" }}
            >
              V {version}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
  
}
