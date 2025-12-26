# Módulo de Contratos - Documentación

## Descripción General

El módulo de contratos permite gestionar plantillas de contratos digitales y contratos emitidos con firma electrónica. Está completamente integrado con la arquitectura existente del proyecto y sigue los mismos patrones de diseño.

## Estructura del Módulso

### 1. Capa de Datos (DTOs)

**Ubicación**: `src/components/core/contracts/dto/`

- `ContractTemplateRequest.dto.ts` - DTOs para requests de plantillas
- `ContractTemplateResponse.dto.ts` - DTOs para responses de plantillas
- `ContractRequest.dto.ts` - DTOs para requests de contratos
- `ContractResponse.dto.ts` - DTOs para responses de contratos

### 2. Servicios

**Ubicación**: `src/components/core/contracts/services/`

- `ContractTemplateService.ts` - Operaciones CRUD para plantillas
- `ContractService.ts` - Operaciones CRUD para contratos emitidos

### 3. Use Cases

**Ubicación**: `src/components/core/contracts/use-cases/`

#### Plantillas:
- `GetAllTemplatesUseCase` - Obtener todas las plantillas
- `GetTemplateByIdUseCase` - Obtener plantilla por ID
- `CreateTemplateUseCase` - Crear nueva plantilla
- `UpdateTemplateUseCase` - Actualizar plantilla existente
- `DeleteTemplateUseCase` - Eliminar plantilla

#### Contratos:
- `GetAllContractsUseCase` - Obtener todos los contratos
- `GetContractByIdUseCase` - Obtener contrato por ID
- `CreateContractUseCase` - Crear nuevo contrato
- `SignContractUseCase` - Firmar contrato
- `InvalidateContractUseCase` - Invalidar contrato
- `DeleteContractUseCase` - Eliminar contrato

### 4. Controladores

**Ubicación**: `src/components/core/contracts/controllers/`

- `ContractTemplateController` - Controlador para plantillas
- `ContractController` - Controlador para contratos

### 5. Componentes Visuales

**Ubicación**: `src/app/(dashboard)/contract/`

- `page.tsx` - Página principal con listado de plantillas y contratos
- `create/page.tsx` - Formulario de creación de plantillas
- `edit/[id]/page.tsx` - Formulario de edición de plantillas (pendiente)

**Componentes adicionales**:
- `src/components/contracts/ContractSignDialog.tsx` - Dialog para firma de contratos

### 6. Endpoints API

**Ubicación**: `src/routes/api.config.ts`

```typescript
CONTRACTS: {
  BASE: '/v1/contracts',
  BY_ID: (id: string) => `/v1/contracts/${id}`,
  SIGN: (id: string) => `/v1/contracts/${id}/sign`,
  INVALIDATE: (id: string) => `/v1/contracts/${id}/invalidate`,
  PDF: (id: string) => `/v1/contracts/${id}/pdf`,
  TEMPLATES: {
    BASE: '/v1/contracts/templates',
    BY_ID: (id: string) => `/v1/contracts/templates/${id}`,
    VARIABLES: (templateId: string) => `/v1/contracts/templates/${templateId}/variables`,
  },
  VARIABLES: {
    BY_ID: (id: string) => `/v1/contracts/variables/${id}`,
  },
  PUBLIC: {
    BY_TOKEN: (token: string) => `/v1/public/contracts/${token}`,
    SIGN: (token: string) => `/v1/public/contracts/${token}/sign`,
    STATUS: (token: string) => `/v1/public/contracts/${token}/status`,
  },
}
```

## Características Principales

### 1. Gestión de Plantillas

- **Creación de plantillas** con contenido HTML enriquecido
- **Variables dinámicas** con tipos de datos:
  - TEXT - Texto libre
  - NUMBER - Números
  - DATE - Fechas
  - EMAIL - Correos electrónicos
  - SIGNATURE - Firmas digitales
- **SKU único** para cada plantilla
- **Estado activo/inactivo** para controlar disponibilidad

### 2. Contratos Emitidos

- **Estados de contrato**:
  - DRAFT - Borrador
  - PENDING - Pendiente de firma
  - SIGNED - Firmado
  - EXPIRED - Expirado
  - CANCELLED - Cancelado
- **Firma electrónica** con canvas de dibujo
- **Generación de PDF** de contratos firmados
- **Enlaces públicos** para firma sin autenticación
- **Relación con otros módulos** (reservas, productos, etc.)

### 3. Seguridad

- Tokens públicos para firma sin exponer información sensible
- Validación de expiración de contratos
- Capacidad de invalidar contratos
- Registro de eventos de firma con timestamp

## Uso del Módulo

### Crear una Plantilla de Contrato

```typescript
import { contractTemplateController } from '@/components/core';

const crearPlantilla = async () => {
  const response = await contractTemplateController.create({
    name: 'Contrato de Arrendamiento',
    sku: 'LEASE-001',
    description: 'Plantilla base para alquiler de equipos',
    html_content: '<h1>Contrato</h1><p>Entre {{company_name}} y {{client_name}}</p>',
    variables: [
      {
        key: 'company_name',
        label: 'Nombre de la empresa',
        data_type: 'TEXT',
        required: true,
        default_value: 'Scuba Exagone',
        sort_order: 1
      },
      {
        key: 'client_name',
        label: 'Nombre del cliente',
        data_type: 'TEXT',
        required: true,
        sort_order: 2
      }
    ]
  });
  
  if (response?.success) {
    console.log('Plantilla creada:', response.data);
  }
};
```

### Crear un Contrato Emitido

```typescript
import { contractController } from '@/components/core';

const crearContrato = async () => {
  const response = await contractController.create({
    template_id: 'uuid-de-la-plantilla',
    sku: 'RES-ABC-2025',
    related_type: 'RESERVATION',
    related_id: 'uuid-de-la-reserva',
    signer_name: 'Juan Pérez',
    signer_email: 'juan.perez@example.com',
    expires_at: '2025-12-31T23:59:59Z',
    fields: {
      company_name: 'Scuba Exagone',
      client_name: 'Juan Pérez',
      contract_value: '1.200.000'
    }
  });
  
  if (response?.success) {
    console.log('Contrato creado:', response.data);
    console.log('Token público:', response.data.public_token);
  }
};
```

### Firmar un Contrato

```typescript
import { contractController } from '@/components/core';

const firmarContrato = async (contractId: string, signatureData: string) => {
  const response = await contractController.sign(contractId, {
    signed_by_name: 'Juan Pérez',
    signed_by_email: 'juan.perez@example.com',
    signature_image: signatureData // Base64 de la firma
  });
  
  if (response?.success) {
    console.log('Contrato firmado exitosamente');
  }
};
```

## Variables Disponibles en Plantillas

Las plantillas de contratos pueden usar variables especiales que se reemplazan con los valores proporcionados al crear o firmar un contrato. El formato de uso es `%variable_name%` en el HTML de la plantilla.

### Campos Básicos

- `%email%` - Email del firmante
- `%signer_name%` - Nombre del que firma
- `%identity_type%` - Tipo de identidad (CC, NIT, etc.)
- `%identity_number%` - Número de identidad
- `%company%` - Empresa
- `%signature%` - Firma (se convierte automáticamente en tag `<img>` HTML)

### Información General - Sección 1

- `%general_info_first_name%` - 1.1 Nombre
- `%general_info_last_name%` - 1.2 Apellido
- `%general_info_nationality%` - 1.3 Nacionalidad
- `%general_info_document_type%` - 1.4 Tipo de documento
- `%general_info_document_number%` - 1.5 Número de documento
- `%general_info_email%` - 1.6 Correo electrónico/email
- `%general_info_phone%` - 1.7 Celular/WhatsApp
- `%general_info_address%` - 1.8 Dirección de correspondencia
- `%general_info_address_additional%` - 1.9 Dirección - Información adicional
- `%general_info_address_city%` - 1.10 Dirección - Ciudad
- `%general_info_address_state%` - 1.11 Dirección - Estado
- `%general_info_address_zip_code%` - 1.12 Dirección - Código postal
- `%general_info_address_country%` - 1.13 Dirección - País
- `%general_info_birth_date%` - 1.14 Fecha de nacimiento (formato: YYYY-MM-DD)
- `%general_info_certification_level%` - 1.15 Nivel de certificación actual
- `%general_info_dive_count%` - 1.15 Cantidad de buceos / Logbook dives (número)
- `%general_info_how_did_you_know%` - 1.16 Cómo supo de nosotros
- `%general_info_accommodation%` - 1.17 Lugar de hospedaje
- `%general_info_activity%` - 1.18 Actividad a tomar
- `%general_info_activity_start_date%` - 1.19 Fecha de inicio de la actividad (formato: YYYY-MM-DD)
- `%general_info_height%` - 1.20 Estatura (centímetros, número)
- `%general_info_weight%` - 1.21 Peso (kilogramos, número decimal)
- `%general_info_shoe_size%` - 1.22 Talla de calzado (texto)
- `%general_info_special_requirements%` - 1.23 Requerimientos especiales (texto largo)

### Contacto de Emergencia - Sección 2

- `%emergency_contact_first_name%` - 2.1 Nombre
- `%emergency_contact_last_name%` - 2.2 Apellido
- `%emergency_contact_phone%` - 2.3 Número de teléfono
- `%emergency_contact_email%` - 2.4 Correo electrónico

### Ejemplo de Uso en Plantilla HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Contrato de Servicio</title>
</head>
<body>
    <h1>CONTRATO DE SERVICIO</h1>
    
    <div>
        <p><strong>Email:</strong> %email%</p>
        <p><strong>Nombre del firmante:</strong> %signer_name%</p>
        <p><strong>Tipo de identidad:</strong> %identity_type%</p>
        <p><strong>Número de identidad:</strong> %identity_number%</p>
        <p><strong>Empresa:</strong> %company%</p>
    </div>
    
    <h2>Información General</h2>
    <p><strong>Nombre completo:</strong> %general_info_first_name% %general_info_last_name%</p>
    <p><strong>Email:</strong> %general_info_email%</p>
    <p><strong>Teléfono:</strong> %general_info_phone%</p>
    <p><strong>Dirección:</strong> %general_info_address%, %general_info_address_city%</p>
    
    <h2>Contacto de Emergencia</h2>
    <p><strong>Nombre:</strong> %emergency_contact_first_name% %emergency_contact_last_name%</p>
    <p><strong>Teléfono:</strong> %emergency_contact_phone%</p>
    
    <div>
        <h2>Firma:</h2>
        %signature%
    </div>
    
    <p>Fecha: ___________</p>
</body>
</html>
```

**Nota**: La variable `%signature%` se reemplaza automáticamente con un tag `<img>` HTML cuando el contrato es firmado. Si el contrato aún no está firmado, la variable se muestra vacía.

## Línea Gráfica

El módulo sigue la misma línea gráfica del resto de la aplicación:

### Colores
- **Principal**: #424242 (gris oscuro)
- **Secundario**: #757575 (gris medio)
- **Bordes**: #e0e0e0
- **Estados activos**: #4caf50 (verde)
- **Estados inactivos**: #f44336 (rojo)
- **Información**: #1976d2 (azul)

### Componentes
- Botones con `textTransform: 'capitalize'`
- Bordes redondeados sutiles (`borderRadius: 1 o 2`)
- Estados hover con cambio de color de fondo
- Chips para mostrar estados y contadores
- Iconos de Material-UI
- Tablas con hover effects

### Tipografía
- Títulos: 18-20px, bold
- Subtítulos: 16px, bold
- Texto: 14px, regular
- Captions: 12-13px

## Dependencias Adicionales

Para el componente de firma, se necesita instalar:

```bash
npm install react-signature-canvas
npm install --save-dev @types/react-signature-canvas
```

## Integración con Backend

El módulo está diseñado para consumir los siguientes endpoints del backend (según el Postman collection):

- `POST /api/v1/contracts/templates` - Crear plantilla
- `GET /api/v1/contracts/templates` - Obtener plantillas
- `GET /api/v1/contracts/templates/:id` - Obtener plantilla por ID
- `PUT /api/v1/contracts/templates/:id` - Actualizar plantilla
- `POST /api/v1/contracts` - Crear contrato
- `GET /api/v1/contracts` - Obtener contratos
- `GET /api/v1/contracts/:id` - Obtener contrato por ID
- `POST /api/v1/contracts/:id/sign` - Firmar contrato
- `POST /api/v1/contracts/:id/invalidate` - Invalidar contrato
- `GET /api/v1/contracts/:id/pdf` - Descargar PDF
- `GET /api/v1/public/contracts/:token` - Obtener contrato por token público
- `POST /api/v1/public/contracts/:token/sign` - Firmar por token público

## Próximas Mejoras

1. Página de edición de plantillas (`edit/[id]/page.tsx`)
2. Vista previa del contrato renderizado con variables
3. Envío automático de emails con enlaces de firma
4. Historial de firmas y auditoría
5. Plantillas predefinidas para casos comunes
6. Exportación de contratos en múltiples formatos
7. Firma múltiple (múltiples firmantes)
8. Recordatorios automáticos de firma pendiente

## Mantenimiento

- Los componentes siguen el patrón de arquitectura limpia
- Los DTOs están tipados con TypeScript
- Los servicios manejan errores de forma consistente
- Los controladores abstraen la lógica de negocio
- Los use cases encapsulan operaciones específicas

Para agregar nuevas funcionalidades, seguir el mismo patrón:
1. Agregar DTOs necesarios
2. Crear servicio si se requiere comunicación con API
3. Crear use case para lógica de negocio
4. Exponer funcionalidad en controlador
5. Crear componente visual
6. Actualizar rutas si es necesario

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.

