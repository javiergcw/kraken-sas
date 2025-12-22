FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Instala git y ssh para permitir dependencias vía Git
RUN apk add --no-cache git openssh

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --legacy-peer-deps

# Copia todo el código fuente al contenedor
COPY . .

# Elimina posibles builds anteriores
RUN rm -rf .next

# Construye la aplicación Next.js para producción
RUN npm run build

# Define el puerto predeterminado que escuchará Next.js
ENV PORT=4001

# Expone el puerto para enlazar con el host
EXPOSE 4001

# Comando de inicio de la aplicación
CMD ["npm", "start"]

