#!/bin/bash

# Instalar librerías del sistema si estamos en Debian/Ubuntu
if grep -qi 'debian\|ubuntu' /etc/os-release 2>/dev/null; then
    echo "Instalando librerías del sistema para canvas..."
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        libcairo2-dev \
        libpango1.0-dev \
        libjpeg-dev \
        libgif-dev \
        librsvg2-dev
fi

# Verifica si existe docker-compose.yml
if [ -f docker-compose.yml ]; then
    echo "Usando docker-compose para el despliegue..."
    docker-compose down
    docker-compose up -d --build
else
    echo "Construyendo la imagen Docker..."
    docker build -t kraken-sas:latest .

    echo "Deteniendo contenedores anteriores..."
    docker stop kraken-sas || true
    docker rm kraken-sas || true

    echo "Ejecutando el contenedor..."
    docker run -d --name kraken-sas -p 4001:4001 --restart unless-stopped kraken-sas:latest
fi

