import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// GET - Obtener credenciales de la compañía
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticación no proporcionado' },
        { status: 401 }
      );
    }

    const response = await fetch(EXTERNAL_ROUTES.COMPANY_CREDENTIALS.BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      data = { message: responseText || 'Error al obtener credenciales' };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al hacer la petición', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar credenciales de la compañía
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticación no proporcionado' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Error al parsear el cuerpo de la petición' },
        { status: 400 }
      );
    }

    const response = await fetch(EXTERNAL_ROUTES.COMPANY_CREDENTIALS.BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      data = { message: responseText || 'Credenciales actualizadas exitosamente' };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al hacer la petición', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

