import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

export async function GET(req: NextRequest) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticación no proporcionado' },
        { status: 401 }
      );
    }

    console.log('[/api/auth/me] Realizando petición a:', EXTERNAL_ROUTES.AUTH.ME);
    console.log('[/api/auth/me] Authorization header presente:', !!authHeader);

    const response = await fetch(EXTERNAL_ROUTES.AUTH.ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      // Agregar timeout y configuración adicional
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    console.log('[/api/auth/me] Respuesta status:', response.status);

    // Leer el texto de la respuesta primero
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[/api/auth/me] Error al parsear respuesta:', parseError);
      // Si no es JSON, devolver como texto
      data = { error: 'Respuesta no válida', message: responseText };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[/api/auth/me] Error en la petición:', error);
    
    // Detectar si es un error de timeout o de red
    let errorMessage = 'Error al hacer la petición';
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout: El servidor no respondió a tiempo';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Error de red: No se pudo conectar con el servidor';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error instanceof Error ? error.message : 'Unknown error',
        endpoint: EXTERNAL_ROUTES.AUTH.ME,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

