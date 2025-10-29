'use client';

import React from 'react';
import ProductForm from '@/components/productos/ProductForm';
import { productController } from '@/components/core';
import { ProductCreateRequestDto } from '@/components/core/products/dto/ProductRequest.dto';

const CreateProductPage: React.FC = () => {
  const handleSubmit = async (data: ProductCreateRequestDto) => {
    try {
      const response = await productController.create(data);
      if (response?.success) {
        return response.data;
      }
      throw new Error(response?.message || 'Error al crear producto');
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
    />
  );
};

export default CreateProductPage;
