# Implementación de Storage S3

## 📁 Descripción

Se ha implementado un sistema completo de gestión de archivos usando S3 para el proyecto Kraken SAS. Este sistema permite subir archivos a carpetas específicas y visualizar los archivos existentes.

## 🏗️ Arquitectura

La implementación sigue el patrón de arquitectura limpia del proyecto:

```
src/
├── components/
│   ├── core/
│   │   └── storage/
│   │       ├── controllers/
│   │       │   └── StorageController.ts
│   │       ├── dto/
│   │       │   ├── StorageRequest.dto.ts
│   │       │   ├── StorageResponse.dto.ts
│   │       │   └── index.ts
│   │       ├── services/
│   │       │   ├── StorageService.ts
│   │       │   └── index.ts
│   │       ├── use-cases/
│   │       │   ├── UploadFileUseCase.ts
│   │       │   ├── GetFoldersUseCase.ts
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── productos/
│   │   └── ProductMediaManager.tsx (Integración con productos)
│   └── storage/
│       ├── FileUploader.tsx (Componente reutilizable)
│       ├── FolderBrowser.tsx (Componente reutilizable)
│       └── index.ts
├── hooks/
│   └── useStorage.ts (Hook personalizado)
├── app/
│   └── api/
│       └── v1/
│           └── storage/
│               ├── files/
│               │   └── route.ts (POST - Subir archivo)
│               └── folders/
│                   └── route.ts (GET - Obtener carpetas)
└── routes/
    └── api.config.ts (Actualizado con endpoints)
```

## 🔌 API Endpoints

### 1. Subir Archivo

**Endpoint:** `POST /api/v1/storage/files`

**Tipo:** `form-data`

**Parámetros:**
- `folder_path` (string): Nombre de la carpeta destino (ej: "productos", "banners")
- `file` (File): Archivo a subir

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg",
    "original_name": "producto.jpg",
    "path": "productos/68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg",
    "unique_code": "68c9206f-ba09-4cd5-90d6-76cfd38e76fc",
    "url": "http://154.38.181.22:9000/oceanoscuba/productos/68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg"
  }
}
```

### 2. Obtener Carpetas y Archivos

**Endpoint:** `GET /api/v1/storage/folders`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "productos",
      "path": "productos/",
      "files": [
        {
          "name": "68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg",
          "path": "productos/68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg",
          "size": 3134,
          "last_modified": "2025-11-06T16:06:59.42Z",
          "url": "http://154.38.181.22:9000/oceanoscuba/productos/68c9206f-ba09-4cd5-90d6-76cfd38e76fc.jpg"
        }
      ]
    },
    {
      "name": "banners",
      "path": "banners/",
      "files": []
    }
  ]
}
```

## 🎣 Hook useStorage

El hook `useStorage` proporciona una interfaz sencilla para interactuar con el sistema de storage:

```typescript
import { useStorage } from '@/hooks/useStorage';

function MyComponent() {
  const { 
    uploadFile, 
    getFolders, 
    isUploading, 
    isLoadingFolders, 
    uploadError, 
    foldersError 
  } = useStorage();

  // Subir archivo
  const handleUpload = async (file: File) => {
    try {
      const response = await uploadFile('productos', file);
      console.log('URL del archivo:', response.data.url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Obtener carpetas
  const handleGetFolders = async () => {
    try {
      const response = await getFolders();
      console.log('Carpetas:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isUploading && <p>Subiendo archivo...</p>}
      {uploadError && <p>Error: {uploadError}</p>}
    </div>
  );
}
```

## 🧩 Componentes Reutilizables

### 1. FileUploader

Componente para subir archivos con preview y validaciones:

```typescript
import { FileUploader } from '@/components/storage';

function MyPage() {
  const handleSuccess = (url: string, data: any) => {
    console.log('Archivo subido:', url);
  };

  return (
    <FileUploader
      folderPath="productos"
      onUploadSuccess={handleSuccess}
      acceptedFileTypes="image/*"
      maxSizeMB={10}
    />
  );
}
```

**Props:**
- `folderPath`: Carpeta destino
- `onUploadSuccess?`: Callback al subir exitosamente
- `onUploadError?`: Callback en caso de error
- `acceptedFileTypes?`: Tipos de archivo aceptados (default: "*")
- `maxSizeMB?`: Tamaño máximo en MB (default: 10)

### 2. FolderBrowser

Componente para explorar carpetas y archivos:

```typescript
import { FolderBrowser } from '@/components/storage';

function MyPage() {
  const handleFileSelect = (url: string, name: string) => {
    console.log('Archivo seleccionado:', url);
  };

  return (
    <FolderBrowser
      onFileSelect={handleFileSelect}
      refreshTrigger={Date.now()}
    />
  );
}
```

**Props:**
- `onFileSelect?`: Callback al seleccionar un archivo
- `refreshTrigger?`: Número para forzar recarga (ej: timestamp)

### 3. ProductMediaManager

Componente integrado específicamente para la gestión de imágenes de productos:

```typescript
import ProductMediaManager from '@/components/productos/ProductMediaManager';

function ProductForm() {
  const [currentImage, setCurrentImage] = useState('');

  return (
    <ProductMediaManager
      currentImage={currentImage}
      onImageSelect={(url) => setCurrentImage(url)}
      onImageRemove={() => setCurrentImage('')}
    />
  );
}
```

**Características:**
- Sube archivos a la carpeta "productos"
- Muestra solo las imágenes de la carpeta productos
- Incluye búsqueda, ordenamiento y vistas (grid/lista)
- Validación de tipos de archivo y tamaño
- Preview de imagen seleccionada

## 📦 Integración en Productos

El sistema ya está integrado en el módulo de productos:

1. **Crear Producto:** `/productos/create`
2. **Editar Producto:** `/productos/edit/[id]`

### Características:
- ✅ Subir nuevas imágenes directamente a S3 carpeta "productos"
- ✅ Ver todas las imágenes existentes en la carpeta productos
- ✅ Seleccionar imagen existente sin necesidad de subirla nuevamente
- ✅ Preview de la imagen seleccionada
- ✅ Búsqueda y filtros de imágenes
- ✅ Vista grid y lista
- ✅ Ordenamiento por fecha (ascendente/descendente)
- ✅ Validación de tipos de archivo (jpg, jpeg, png, svg)
- ✅ Validación de tamaño máximo (10MB)

## 📦 Integración en Banners

El sistema también está integrado en el módulo de banners/marketing:

1. **Crear Banner:** `/marketing/banner`
2. **Editar Banner:** `/marketing/banner`

### Características:
- ✅ Subir nuevas imágenes directamente a S3 carpeta "banners"
- ✅ Ver todas las imágenes existentes en la carpeta banners
- ✅ Seleccionar imagen existente sin necesidad de subirla nuevamente
- ✅ Preview de la imagen seleccionada (80x80px)
- ✅ Búsqueda y filtros de imágenes
- ✅ Vista grid y lista
- ✅ Ordenamiento por fecha (ascendente/descendente)
- ✅ Validación de tipos de archivo (jpg, jpeg, png, svg)
- ✅ Validación de tamaño máximo (10MB)
- ✅ Subida automática al seleccionar archivo
- ✅ Sin alertas intrusivas

### Componente BannerMediaManager

```typescript
import BannerMediaManager from '@/components/marketing/BannerMediaManager';

function BannerForm() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <BannerMediaManager
      currentImage={imageUrl}
      onImageSelect={(url) => setImageUrl(url)}
      onImageRemove={() => setImageUrl('')}
    />
  );
}
```

**Características:**
- Sube archivos a la carpeta "banners"
- Muestra solo las imágenes de la carpeta banners
- Incluye búsqueda, ordenamiento y vistas (grid/lista)
- Validación de tipos de archivo y tamaño
- Preview de imagen seleccionada (miniatura 80x80px)
- Integrado en BannerDialog

## 🔒 Seguridad

- Todas las peticiones requieren token de autenticación
- Las rutas API de Next.js actúan como proxy al API externa
- Validación de tipos de archivo en el cliente
- Validación de tamaño máximo de archivo

## 🚀 Uso en Otros Módulos

Para usar el sistema S3 en otros módulos (ej: categorías, subcategorías):

### Opción 1: Usar componentes reutilizables

```typescript
import { FileUploader, FolderBrowser } from '@/components/storage';

function BannerPage() {
  return (
    <div>
      <FileUploader
        folderPath="banners"
        onUploadSuccess={(url) => console.log(url)}
      />
      <FolderBrowser />
    </div>
  );
}
```

### Opción 2: Usar el hook directamente

```typescript
import { useStorage } from '@/hooks/useStorage';

function CategoryForm() {
  const { uploadFile, getFolders } = useStorage();

  const handleImageUpload = async (file: File) => {
    const response = await uploadFile('categorias', file);
    return response.data.url;
  };

  return (
    // Tu componente
  );
}
```

### Opción 3: Crear componente específico (como ProductMediaManager)

Crear un componente personalizado para el módulo específico que use el hook `useStorage` internamente.

## 📝 Notas Importantes

1. **Carpetas**: El backend crea automáticamente las carpetas si no existen
2. **Nombres de archivo**: El backend genera un UUID único para cada archivo
3. **URL pública**: Los archivos son accesibles públicamente a través de la URL proporcionada
4. **Formato de respuesta**: Siempre incluye `success`, `message` y `data`

## 🔧 Configuración

Los endpoints están configurados en `/src/routes/api.config.ts`:

```typescript
STORAGE: {
  UPLOAD_FILE: '/v1/storage/files',
  GET_FOLDERS: '/v1/storage/folders',
}
```

Rutas externas:
```typescript
STORAGE: {
  UPLOAD_FILE: '${EXTERNAL_API_URL}/api/v1/storage/files',
  GET_FOLDERS: '${EXTERNAL_API_URL}/api/v1/storage/folders',
}
```

## 🎨 UI/UX

- Diseño consistente con el resto de la aplicación
- Estados de carga (spinners)
- Mensajes de error claros
- Preview de imágenes
- Drag & drop (preparado para futuro)
- Responsive design

## ✅ Testing

Para probar la implementación:

1. Ir a `/productos/create`
2. Click en "Gestionar imágenes"
3. Subir una imagen nueva
4. Verificar que aparece en la lista
5. Seleccionar la imagen
6. Verificar que se muestra el preview

## 🐛 Solución de Problemas

### Error: "Token de autenticación no proporcionado"
- Verificar que el usuario esté autenticado
- Revisar que el token esté en localStorage

### Error: "Solo se permiten imágenes..."
- Verificar el tipo de archivo
- Formatos permitidos: jpg, jpeg, png, svg

### Error: "El archivo es muy grande"
- Reducir el tamaño del archivo
- Límite actual: 10MB

### Las imágenes no se cargan
- Verificar conexión al servidor S3
- Revisar la consola del navegador
- Verificar los endpoints en api.config.ts

## 📚 Referencias

- [Documentación de Material-UI](https://mui.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)


