# Guía de Solución: Error "Failed to fetch" en GetMeUseCase

## 📋 Descripción del Error

```
Error en GetMeUseCase: Network error: Failed to fetch
```

Este error ocurre cuando la aplicación intenta obtener la información del usuario autenticado mediante el endpoint `/api/auth/me`.

## 🔍 Diagnóstico Mejorado

Se han agregado **logs detallados** en varios puntos de la cadena de llamadas para ayudar a identificar dónde ocurre exactamente el fallo:

### 1. **HttpService** (`src/utils/http.service.ts`)
- ✅ Log de la URL completa de la petición
- ✅ Log del método HTTP usado
- ✅ Log del status de la respuesta
- ✅ Log detallado de errores de red

### 2. **UserService** (`src/components/core/user/services/UserService.ts`)
- ✅ Log del endpoint llamado
- ✅ Log de éxito/error de la respuesta
- ✅ Log detallado de errores

### 3. **GetMeUseCase** (`src/components/core/user/use-cases/GetMeUseCase.ts`)
- ✅ Log detallado de errores con stack trace

### 4. **API Route** (`src/app/api/auth/me/route.ts`)
- ✅ Log de la URL externa llamada
- ✅ Log de presencia de token de autenticación
- ✅ Log del status de respuesta del servidor externo
- ✅ Timeout de 10 segundos configurado
- ✅ Detección de tipo de error (timeout, red, etc.)

## 🔧 Posibles Causas y Soluciones

### Causa 1: Servidor Externo No Accesible
**Síntomas:**
- Error "Failed to fetch" inmediato
- Logs en `/api/auth/me` muestran error antes de recibir respuesta

**Solución:**
1. Verificar que `https://api.oceanoscuba.com.co` esté accesible
2. Probar el endpoint manualmente:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.oceanoscuba.com.co/api/v1/auth/me
```

### Causa 2: Token Inválido o Expirado
**Síntomas:**
- Respuesta 401 Unauthorized
- Logs muestran que la petición llega pero es rechazada

**Solución:**
1. Verificar el token en localStorage: `auth_token`
2. Refrescar el token haciendo login nuevamente
3. Revisar la fecha de expiración del token

### Causa 3: CORS (Cross-Origin Resource Sharing)
**Síntomas:**
- Error en el navegador sobre CORS
- La petición se cancela antes de completarse

**Solución:**
El servidor backend debe tener habilitados los headers CORS:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Causa 4: Timeout del Servidor
**Síntomas:**
- Error "AbortError" después de 10 segundos
- Logs muestran que la petición inicia pero no completa

**Solución:**
1. Aumentar el timeout en `src/app/api/auth/me/route.ts`:
```typescript
signal: AbortSignal.timeout(30000), // 30 segundos
```
2. Investigar por qué el servidor backend es lento

### Causa 5: Ruta Backend Incorrecta
**Síntomas:**
- Error 404 Not Found
- Logs muestran la URL llamada

**Verificar:**
La URL configurada en `src/routes/api.config.ts`:
```typescript
AUTH: {
  ME: `${EXTERNAL_API_URL}/api/v1/auth/me`,
}
```

Debe coincidir con la ruta real del backend.

## 📊 Cómo Interpretar los Logs

Con las mejoras implementadas, ahora verás logs como:

```
[HttpService] GET /api/auth/me
[UserService] Llamando a: /auth/me
[/api/auth/me] Realizando petición a: https://api.oceanoscuba.com.co/api/v1/auth/me
[/api/auth/me] Authorization header presente: true
[/api/auth/me] Respuesta status: 200
[HttpService] Response status: 200
[UserService] Respuesta recibida: exitosa
```

Si hay error, verás algo como:
```
[HttpService] GET /api/auth/me
[UserService] Llamando a: /auth/me
[/api/auth/me] Realizando petición a: https://api.oceanoscuba.com.co/api/v1/auth/me
[/api/auth/me] Error en la petición: [detalles del error]
[HttpService] Error de red: {...}
[UserService] Error en getMe: {...}
[GetMeUseCase] Error al obtener usuario: {...}
```

## 🚀 Pasos para Resolver

1. **Recargar la aplicación** y observar los logs en la consola del navegador
2. **Identificar en qué punto falla**:
   - Si falla en `[/api/auth/me]` → Problema con el servidor externo
   - Si falla en `[HttpService]` → Problema con la configuración local
3. **Verificar conectividad**:
   ```bash
   # Probar si el servidor externo responde
   curl https://api.oceanoscuba.com.co/health
   ```
4. **Verificar autenticación**:
   - Abrir DevTools → Application → Local Storage
   - Buscar la key `auth_token`
   - Copiar el token y probarlo manualmente

5. **Si el problema persiste**:
   - Revisar los logs del servidor backend
   - Verificar la configuración de red/firewall
   - Contactar al administrador del servidor backend

## 🔗 Archivos Modificados

- `src/app/api/auth/me/route.ts` - Proxy mejorado con logs y timeout
- `src/utils/http.service.ts` - Logs de peticiones HTTP
- `src/components/core/user/services/UserService.ts` - Logs de servicio
- `src/components/core/user/use-cases/GetMeUseCase.ts` - Logs de use case

## 💡 Recomendaciones

1. **En producción**, desactivar o reducir los logs para evitar exponer información sensible
2. **Implementar reintentos automáticos** para peticiones fallidas
3. **Agregar un health check** al inicio de la aplicación
4. **Mostrar mensaje amigable** al usuario en caso de error de conexión

## 📝 Próximos Pasos

Si el error persiste después de revisar los logs:
1. Compartir los logs completos de la consola
2. Verificar el estado del servidor backend
3. Probar con otra red (para descartar problemas de firewall)

