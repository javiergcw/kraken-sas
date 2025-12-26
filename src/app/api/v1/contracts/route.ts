import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// GET - Obtener todos los contratos
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autenticación no proporcionado' },
        { status: 401 }
      );
    }

    const response = await fetch(EXTERNAL_ROUTES.CONTRACTS.BASE, {
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
      data = { message: responseText || 'Error al obtener contratos' };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// POST - Crear contrato
// 
// Body esperado:
// {
//   "template_id": "string" (requerido),
//   "sku": "string" (requerido),
//   "code": "string" (opcional),
//   "related_type": "RESERVATION" | "PRODUCT" | "VESSEL" | "RENT" (opcional),
//   "related_id": "string" (opcional),
//   "expires_at": "ISO 8601 date string" (opcional),
//   "fields": {
//     // Campos básicos opcionales
//     "email": "string",
//     "signer_name": "string",
//     "identity_type": "string",
//     "identity_number": "string",
//     "company": "string",
//     "signature": "data:image/png;base64,...",
//     // Información General (23 campos opcionales)
//     "general_info_first_name": "string",
//     "general_info_last_name": "string",
//     "general_info_nationality": "string",
//     "general_info_document_type": "string",
//     "general_info_document_number": "string",
//     "general_info_email": "string",
//     "general_info_phone": "string",
//     "general_info_address": "string",
//     "general_info_address_additional": "string",
//     "general_info_address_city": "string",
//     "general_info_address_state": "string",
//     "general_info_address_zip_code": "string",
//     "general_info_address_country": "string",
//     "general_info_birth_date": "string",
//     "general_info_certification_level": "string",
//     "general_info_dive_count": "number",
//     "general_info_how_did_you_know": "string",
//     "general_info_accommodation": "string",
//     "general_info_activity": "string",
//     "general_info_activity_start_date": "string",
//     "general_info_height": "number",
//     "general_info_weight": "number",
//     "general_info_shoe_size": "string",
//     "general_info_special_requirements": "string",
//     // Contacto de Emergencia (4 campos opcionales)
//     "emergency_contact_first_name": "string",
//     "emergency_contact_last_name": "string",
//     "emergency_contact_phone": "string",
//     "emergency_contact_email": "string",
//     // Campos personalizados adicionales
//     [key: string]: any
//   }
// }
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

    // Validación básica de campos requeridos
    if (!body.template_id || !body.sku) {
      return NextResponse.json(
        { error: 'Los campos template_id y sku son requeridos' },
        { status: 400 }
      );
    }

    // Asegurar que fields sea un objeto
    if (!body.fields || typeof body.fields !== 'object') {
      body.fields = {};
    }

    const response = await fetch(EXTERNAL_ROUTES.CONTRACTS.BASE, {
      method: 'POST',
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
      data = { message: responseText || 'Contrato creado exitosamente' };
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

