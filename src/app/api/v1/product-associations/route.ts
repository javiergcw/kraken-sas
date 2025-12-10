import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// GET - Obtener asociaciones de productos
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Token de autenticación no proporcionado' },
                { status: 401 }
            );
        }

        // Obtener los parámetros de búsqueda de la URL
        const searchParams = req.nextUrl.searchParams;
        const queryString = searchParams.toString();
        const url = `${EXTERNAL_ROUTES.PRODUCT_ASSOCIATIONS.BASE}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        });

        // Leer el texto de la respuesta primero
        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            // Si no es JSON, devolver el texto como mensaje
            data = { message: responseText || 'Error al obtener asociaciones de productos' };
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

// POST - Crear asociación de producto
export async function POST(req: NextRequest) {
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

        const response = await fetch(EXTERNAL_ROUTES.PRODUCT_ASSOCIATIONS.BASE, {
            method: 'POST',
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
            data = { message: responseText || 'Asociación creada exitosamente' };
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
