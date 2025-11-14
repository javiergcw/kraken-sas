import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_ROUTES } from '@/routes/api.config';

// GET - Descargar PDF del contrato
export async function GET(
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

    console.log('[PDF Download] Requesting PDF for contract:', id);
    console.log('[PDF Download] URL:', EXTERNAL_ROUTES.CONTRACTS.PDF(id));

    const response = await fetch(EXTERNAL_ROUTES.CONTRACTS.PDF(id), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    console.log('[PDF Download] Response status:', response.status);
    console.log('[PDF Download] Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      // Intentar leer el error como texto
      const errorText = await response.text();
      console.error('[PDF Download] Error response:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Error al descargar PDF', 
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Verificar el tipo de contenido
    const contentType = response.headers.get('content-type');
    
    // Si es HTML, significa que el PDF no está generado o hay un error
    if (contentType?.includes('text/html')) {
      const htmlContent = await response.text();
      console.log('[PDF Download] Received HTML instead of PDF:', htmlContent.substring(0, 200));
      
      return NextResponse.json(
        { 
          error: 'PDF no disponible',
          message: 'El PDF del contrato aún no ha sido generado. Por favor, genera el PDF primero.',
          html_snapshot: htmlContent,
          needsGeneration: true
        },
        { status: 404 }
      );
    }

    // Si es JSON, puede ser un error del backend
    if (contentType?.includes('application/json')) {
      const jsonData = await response.json();
      console.log('[PDF Download] Received JSON:', jsonData);
      
      return NextResponse.json(jsonData, {
        status: response.status,
      });
    }

    // Si es PDF o cualquier otro tipo binario, descargarlo
    // Leer como ArrayBuffer para poder inspeccionar y reutilizar
    const arrayBuffer = await response.arrayBuffer();
    console.log('[PDF Download] Response size:', arrayBuffer.byteLength);

    // Validación adicional: verificar que no sea HTML disfrazado de PDF
    if (arrayBuffer.byteLength < 50000) { // PDFs suelen ser más grandes, verificar si es pequeño
      const text = new TextDecoder().decode(arrayBuffer.slice(0, Math.min(1000, arrayBuffer.byteLength)));
      console.log('[PDF Download] Content preview:', text.substring(0, 200));
      
      if (text.includes('<html') || text.includes('<h1>') || text.includes('<!DOCTYPE') || text.includes('<p>')) {
        console.error('[PDF Download] Response claims to be PDF but contains HTML');
        return NextResponse.json(
          { 
            error: 'PDF no disponible',
            message: 'El PDF del contrato aún no ha sido generado. Por favor, genera el PDF primero.',
            html_snapshot: text,
            needsGeneration: true
          },
          { status: 404 }
        );
      }
    }

    // Verificar firma PDF (los PDFs comienzan con %PDF-)
    const pdfSignature = new TextDecoder().decode(arrayBuffer.slice(0, 5));
    if (!pdfSignature.startsWith('%PDF-')) {
      console.error('[PDF Download] Invalid PDF signature:', pdfSignature);
      const text = new TextDecoder().decode(arrayBuffer.slice(0, Math.min(500, arrayBuffer.byteLength)));
      
      if (text.includes('<') || text.includes('>')) {
        return NextResponse.json(
          { 
            error: 'PDF no disponible',
            message: 'El contenido recibido no es un PDF válido.',
            needsGeneration: true
          },
          { status: 404 }
        );
      }
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrato-${id}.pdf"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[PDF Download] Exception:', error);
    return NextResponse.json(
      { 
        error: 'Error al hacer la petición', 
        details: error instanceof Error ? error.message : 'Unknown error',
        endpoint: EXTERNAL_ROUTES.CONTRACTS.PDF((await params).id)
      },
      { status: 500 }
    );
  }
}

// POST - Generar/Regenerar PDF del contrato
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
      body = {};
    }

    console.log('[PDF Generate] Generating PDF for contract:', id);
    console.log('[PDF Generate] Request body:', body);
    console.log('[PDF Generate] URL:', EXTERNAL_ROUTES.CONTRACTS.PDF(id));

    const response = await fetch(EXTERNAL_ROUTES.CONTRACTS.PDF(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    console.log('[PDF Generate] Response status:', response.status);
    console.log('[PDF Generate] Response content-type:', response.headers.get('content-type'));

    const responseText = await response.text();
    console.log('[PDF Generate] Response text:', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.warn('[PDF Generate] Response is not JSON, using as text');
      data = { message: responseText || 'PDF generado exitosamente' };
    }

    console.log('[PDF Generate] Parsed data:', data);

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[PDF Generate] Exception:', error);
    return NextResponse.json(
      { 
        error: 'Error al hacer la petición', 
        details: error instanceof Error ? error.message : 'Unknown error',
        endpoint: EXTERNAL_ROUTES.CONTRACTS.PDF((await params).id)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

