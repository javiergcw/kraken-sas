'use client';

import React, { use } from 'react';
import ProductForm from '@/components/productos/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
  const { id } = use(params);

  // Aquí irían los datos del producto desde la API
  // Por ahora usamos datos de ejemplo
  const initialData = {
    name: 'Discover Scuba Diving - Minicurso',
    sku: 'discover-scuba-diving--minicurso',
    description: '🤿Si quieres vivir la experiencia de bucear por un día, el mini curso es perfecto para ti. Es una sesión de un día de buceo, que incluye dos inmersiones en diferentes puntos del parque Tayrona.',
    category: 'aventuras',
    subcategory: 'principales',
    price: '410000',
    hasStock: true,
    quantity: 10,
  };

  const initialImages = [
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100&h=100&fit=crop&crop=face',
  ];

  const initialCharacteristics = [
    {
      id: 'parent_1',
      type: 'parent' as const,
      select: 'talla',
      name: 'Tallas disponibles',
      order: 1,
    },
    {
      id: 'child_1',
      type: 'child' as const,
      parentId: 'parent_1',
      select: 'talla',
      name: 'Talla S',
      value: 'S',
      order: 0,
    },
    {
      id: 'child_2',
      type: 'child' as const,
      parentId: 'parent_1',
      select: 'talla',
      name: 'Talla M',
      value: 'M',
      order: 0,
    },
  ];

  const handleSubmit = (data: any) => {
    console.log('Editando producto con ID:', id);
    console.log('Datos del formulario:', data);
    
    // Aquí iría la lógica para enviar los datos actualizados a la API
    // Por ejemplo:
    // await fetch(`/api/productos/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    // });
    
    // Simular guardado exitoso
    console.log('✅ Producto actualizado exitosamente');
  };

  return (
    <ProductForm
      mode="edit"
      initialData={initialData}
      initialImages={initialImages}
      initialCharacteristics={initialCharacteristics}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProductPage;

