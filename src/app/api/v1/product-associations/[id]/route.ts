import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// PUT - Actualizar asociación de producto
export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const authHeader = req.headers.get('Authorization');
        const id = params.id;

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

        const response = await fetch(EXTERNAL_ROUTES.PRODUCT_ASSOCIATIONS.BY_ID(id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
        });

        // Leer el texto de la respuesta primero
        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            // Si no es JSON, devolver el texto como mensaje
            data = { message: responseText || 'Asociación actualizada exitosamente' };
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
