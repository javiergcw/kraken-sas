import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_API_URL } from '@/routes/api.config';

/**
 * POST /api/v1/operation-participants/:id/notes
 * Crea una nota para un participante de un grupo de operación
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validar que se proporcionen los campos requeridos
    if (!body.note || typeof body.note !== 'string' || body.note.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'El campo "note" es requerido y debe ser un texto válido' },
        { status: 400 }
      );
    }

    // Obtener el token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionó token de autorización' },
        { status: 401 }
      );
    }

    // Preparar el payload solo con los campos que acepta el API
    const payload: {
      note: string;
      color?: string;
    } = {
      note: body.note,
    };

    // Solo incluir color si se proporciona
    if (body.color && typeof body.color === 'string') {
      payload.color = body.color;
    }

    // Hacer la petición al API externo
    const externalUrl = `${EXTERNAL_API_URL}/api/v1/operation-participants/${id}/notes`;
    const response = await fetch(externalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Error al crear nota' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al crear nota:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/operation-participants/:id/notes
 * Obtiene todas las notas de un participante
 */
export async function GET(
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
    const externalUrl = `${EXTERNAL_API_URL}/api/v1/operation-participants/${id}/notes`;
    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Error al obtener notas' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener notas:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

