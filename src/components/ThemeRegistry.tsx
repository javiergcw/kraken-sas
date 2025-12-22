'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { Toaster } from 'sonner';

const theme = createTheme({

});




export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster position="top-right" richColors />
      </ThemeProvider>

  );
}

