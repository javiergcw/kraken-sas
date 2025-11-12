'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Typography, Breadcrumbs } from '@mui/material';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DynamicBreadcrumbsProps {
  onMenuClick: () => void;
}

const DynamicBreadcrumbs: React.FC<DynamicBreadcrumbsProps> = ({ onMenuClick }) => {
  const pathname = usePathname();

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard' }];
    
    if (pathSegments.includes('productos')) {
      breadcrumbs.push({ label: 'Productos' });
      
      if (pathSegments.includes('create')) {
        breadcrumbs.push({ label: 'Crear producto' });
      } else if (pathSegments.includes('edit')) {
        breadcrumbs.push({ label: 'Editar producto' });
      }
    } else if (pathSegments.includes('categorias')) {
      breadcrumbs.push({ label: 'Categorías' });
    } else if (pathSegments.includes('historial')) {
      breadcrumbs.push({ label: 'Historial de ventas' });
    } else if (pathSegments.includes('marketing')) {
      if (pathSegments.includes('banner')) {
        breadcrumbs.push({ label: 'Marketing | publicidad' });
        breadcrumbs.push({ label: 'Banner' });
      }
    } else if (pathSegments.includes('herramientas')) {
      if (pathSegments.includes('configuracion')) {
        breadcrumbs.push({ label: 'Herramientas' });
        breadcrumbs.push({ label: 'Configuración' });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs
      separator=">"
      sx={{
        '& .MuiBreadcrumbs-separator': {
          color: '#757575',
          fontSize: '14px',
        },
      }}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            color: '#424242',
            fontSize: '14px',
            fontWeight: index === breadcrumbs.length - 1 ? 'bold' : 'normal',
          }}
        >
          {breadcrumb.label}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
