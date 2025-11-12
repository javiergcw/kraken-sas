'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
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
      </ThemeProvider>

  );
}

