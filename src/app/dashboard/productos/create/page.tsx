'use client';

import React from 'react';
import ProductForm from '@/components/productos/ProductForm';

const CreateProductPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Creando producto:', data);
    // Aquí iría la lógica para enviar los datos a la API
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
    />
  );
};

export default CreateProductPage;
