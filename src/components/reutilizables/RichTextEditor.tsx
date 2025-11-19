/**
 * Editor de texto enriquecido usando Tiptap
 * Soporta: Bold, Italic, Underline, H1, H2, H3, Listas, Links
 * Maneja correctamente las variables de plantilla {{variable}}
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Deshabilitar algunas extensiones que no necesitamos
        code: false,
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      
      // Limpiar variables de plantilla: preservar {{variable}} como texto literal
      // Tiptap puede aplicar estilos, así que limpiamos cualquier etiqueta HTML dentro de las variables
      html = html.replace(/\{\{([^}]*)\}\}/g, (match, content) => {
        // Si el contenido tiene etiquetas HTML, extraer solo el texto
        if (content.includes('<')) {
          const temp = document.createElement('div');
          temp.innerHTML = content;
          const textOnly = temp.textContent || temp.innerText || '';
          return `{{${textOnly.trim()}}}`;
        }
        return match;
      });
      
      // Limpiar variables envueltas en etiquetas
      html = html.replace(/<[^>]+>(\{\{[^}]+\}\})<\/[^>]+>/gi, '$1');
      
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `min-height: ${minHeight}px; padding: 16px;`,
      },
    },
  });

  // Actualizar el contenido cuando cambia el value desde fuera
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!mounted || !editor) {
    return (
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'white',
          minHeight: `${minHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9e9e9e',
        }}
      >
        Cargando editor...
      </Box>
    );
  }

  const insertLink = () => {
    const url = window.prompt('Ingresa la URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
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
            onClick={() => editor.chain().focus().toggleBold().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('bold') ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <BoldIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cursiva (Ctrl+I)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('italic') ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <ItalicIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Subrayado (Ctrl+U)">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('underline') ? '#e0e0e0' : 'transparent',
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
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: editor.isActive('heading', { level: 1 }) ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H1
          </IconButton>
        </Tooltip>

        <Tooltip title="Título H2">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '13px',
              fontWeight: 'bold',
              backgroundColor: editor.isActive('heading', { level: 2 }) ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H2
          </IconButton>
        </Tooltip>

        <Tooltip title="Título H3">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: editor.isActive('heading', { level: 3 }) ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            H3
          </IconButton>
        </Tooltip>

        <Tooltip title="Párrafo">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().setParagraph().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              fontSize: '12px',
              backgroundColor: editor.isActive('paragraph') ? '#e0e0e0' : 'transparent',
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('bulletList') ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <BulletListIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Lista numerada">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('orderedList') ? '#e0e0e0' : 'transparent',
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
              backgroundColor: editor.isActive('link') ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <LinkIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Código">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              backgroundColor: editor.isActive('codeBlock') ? '#e0e0e0' : 'transparent',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <CodeIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor */}
      <Box
        sx={{
          maxHeight: '500px',
          overflowY: 'auto',
          '& .ProseMirror': {
            outline: 'none',
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#424242',
            padding: '16px',
            minHeight: `${minHeight}px`,
            '&:focus': {
              outline: 'none',
            },
            '& p.is-editor-empty:first-child::before': {
              content: `"${placeholder}"`,
              color: '#9e9e9e',
              pointerEvents: 'none',
              float: 'left',
              height: 0,
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
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '2px 4px',
              borderRadius: '2px',
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
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
