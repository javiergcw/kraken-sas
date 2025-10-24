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
