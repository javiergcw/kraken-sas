import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// POST - Subir archivo a una carpeta
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticación no proporcionado' },
        { status: 401 }
      );
    }

    // Obtener el form-data de la petición
    const formData = await req.formData();

    // Crear un nuevo FormData para enviar al backend externo
    const externalFormData = new FormData();
    
    // Copiar todos los campos del form-data
    formData.forEach((value, key) => {
      externalFormData.append(key, value);
    });

    // Hacer la petición al API externo
    const response = await fetch(EXTERNAL_ROUTES.STORAGE.UPLOAD_FILE, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: externalFormData,
    });

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      data = { message: responseText || 'File uploaded successfully' };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error al hacer la petición', 
        details: error instanceof Error ? error.message : 'Unknown error' 
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}


