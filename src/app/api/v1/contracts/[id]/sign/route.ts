import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// POST - Firmar contrato
// 
// Body esperado:
// {
//   "fields": {
//     "signer_name": "string" (requerido),
//     "email": "string" (requerido),
//     // Campos básicos opcionales
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
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    if (!body.fields || typeof body.fields !== 'object') {
      return NextResponse.json(
        { error: 'El campo fields es requerido y debe ser un objeto' },
        { status: 400 }
      );
    }

    if (!body.fields.signer_name || !body.fields.email) {
      return NextResponse.json(
        { error: 'Los campos signer_name y email son requeridos dentro de fields' },
        { status: 400 }
      );
    }

    const response = await fetch(EXTERNAL_ROUTES.CONTRACTS.SIGN(id), {
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
      data = { message: responseText || 'Contrato firmado exitosamente' };
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

