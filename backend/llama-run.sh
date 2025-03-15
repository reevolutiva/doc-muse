#!/bin/bash

# Verificar que se proporcione el argumento -f
while getopts "f:" opt; do
    case $opt in
        f) filename="$OPTARG";;
        *) echo "Uso: $0 -f <archivo_python>"
           exit 1;;
    esac
done

# Verificar que se haya proporcionado un archivo
if [ -z "$filename" ]; then
    echo "Error: Debes especificar un archivo Python con -f"
    echo "Uso: $0 -f <archivo_python>"
    exit 1
fi

# Verificar que el archivo existe
if [ ! -f "/app/$filename" ]; then
    echo "Error: El archivo /app/$filename no existe"
    exit 1
fi

# Ejecutar el archivo Python directamente
echo "Ejecutando: python /app/$filename"
python "/app/$filename"