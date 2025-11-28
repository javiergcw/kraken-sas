import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_API_URL } from '@/routes/api.config';

/**
 * PUT /api/v1/operation-participants/:id
 * Actualiza un participante de un grupo de operación
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionó token de autorización' },
        { status: 401 }
      );
    }

    // Hacer la petición al API externo
    const externalUrl = `${EXTERNAL_API_URL}/api/v1/operation-participants/${id}`;
    const response = await fetch(externalUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Error al actualizar participante' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al actualizar participante:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/operation-participants/:id
 * Elimina un participante de un grupo de operación
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionó token de autorización' },
        { status: 401 }
      );
    }

    // Hacer la petición al API externo
    const externalUrl = `${EXTERNAL_API_URL}/api/v1/operation-participants/${id}`;
    const response = await fetch(externalUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Error al eliminar participante' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al eliminar participante:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

