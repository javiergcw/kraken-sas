/**
 * Editor de texto enriquecido personalizado
 * Soporta: Bold, Italic, Underline, H1, H2, H3, Listas, Links
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Divider, Tooltip } from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  Link as LinkIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  minHeight = 200,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Actualizar el contenido cuando cambia el value desde fuera
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          p: 1,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {/* Formato de texto */}
        <Tooltip title="Negrita (Ctrl+B)">
          <IconButton
            size="small"
            onClick={() => execCommand('bold')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <BoldIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cursiva (Ctrl+I)">
          <IconButton
            size="small"
            onClick={() => execCommand('italic')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <ItalicIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Subrayado (Ctrl+U)">
          <IconButton
            size="small"
            onClick={() => execCommand('underline')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <UnderlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Encabezados */}
        <Tooltip title="Título H1">
          <IconButton
            size="small"
            onClick={() => formatBlock('h1')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '14px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H1
          </IconButton>
        </Tooltip>

        <Tooltip title="Título H2">
          <IconButton
            size="small"
            onClick={() => formatBlock('h2')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '13px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H2
          </IconButton>
        </Tooltip>

        <Tooltip title="Título H3">
          <IconButton
            size="small"
            onClick={() => formatBlock('h3')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '12px',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H3
          </IconButton>
        </Tooltip>

        <Tooltip title="Párrafo">
          <IconButton
            size="small"
            onClick={() => formatBlock('p')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '12px',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            P
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Listas */}
        <Tooltip title="Lista con viñetas">
          <IconButton
            size="small"
            onClick={() => execCommand('insertUnorderedList')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <BulletListIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Lista numerada">
          <IconButton
            size="small"
            onClick={() => execCommand('insertOrderedList')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <NumberListIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Otros */}
        <Tooltip title="Insertar enlace">
          <IconButton
            size="small"
            onClick={insertLink}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <LinkIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Código">
          <IconButton
            size="small"
            onClick={() => formatBlock('pre')}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <CodeIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        sx={{
          minHeight: `${minHeight}px`,
          maxHeight: '500px',
          overflowY: 'auto',
          p: 2,
          outline: 'none',
          fontSize: '14px',
          lineHeight: 1.6,
          color: '#424242',
          '&:empty:before': {
            content: `"${placeholder}"`,
            color: '#9e9e9e',
            pointerEvents: 'none',
          },
          '& h1': {
            fontSize: '2em',
            fontWeight: 'bold',
            marginTop: '0.5em',
            marginBottom: '0.5em',
          },
          '& h2': {
            fontSize: '1.5em',
            fontWeight: 'bold',
            marginTop: '0.5em',
            marginBottom: '0.5em',
          },
          '& h3': {
            fontSize: '1.17em',
            fontWeight: 'bold',
            marginTop: '0.5em',
            marginBottom: '0.5em',
          },
          '& p': {
            marginTop: '0.5em',
            marginBottom: '0.5em',
          },
          '& ul, & ol': {
            marginLeft: '1.5em',
            marginTop: '0.5em',
            marginBottom: '0.5em',
          },
          '& li': {
            marginBottom: '0.25em',
          },
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '13px',
          },
          '& a': {
            color: '#1976d2',
            textDecoration: 'underline',
          },
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 4,
            '&:hover': {
              backgroundColor: '#a8a8a8',
            },
          },
        }}
      />
    </Box>
  );
};

export default RichTextEditor;


