'use client';

import React, { use, useState, useEffect } from 'react';
import ProductForm from '@/components/productos/ProductForm';
import { productController } from '@/components/core';
import { ProductUpdateRequestDto } from '@/components/core/products/dto/ProductRequest.dto';
import { ProductFormData } from '@/components/productos/ProductForm';
import ProductEditSkeleton from '../ProductEditSkeleton';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<ProductFormData | undefined>(undefined);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productController.getById(id);
      if (response?.success && response.data) {
        const product = response.data;
        setInitialData({
          category_id: product.category_id,
          subcategory_id: product.subcategory_id,
          name: product.name,
          short_description: product.short_description,
          long_description: product.long_description,
          photo: product.photo,
          price: product.price,
          dives_only: product.dives_only,
          days_course: product.days_course,
          sku: product.sku,
        });
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ProductUpdateRequestDto) => {
    try {
      const response = await productController.update(id, data);
      if (response?.success) {
        return response.data;
      }
      throw new Error(response?.message || 'Error al actualizar producto');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  };

  if (loading) {
    return <ProductEditSkeleton />;
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditProductPage;

