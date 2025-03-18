#!/bin/bash

# Actualizar fecha en el roadmap
node scripts/update-roadmap-date.js

# Verificar que todos los archivos necesarios existen
echo "Verificando archivos necesarios..."

FILES=(
  "src/components/TemplateNode.tsx"
  "src/components/ui/avatar.tsx"
  "src/components/ui/breadcrumbs.tsx"
  "src/components/ui/form.tsx"
  "src/components/Sidebar.tsx"
  "src/components/DocumentList.tsx"
  "src/contexts/TemplateContext.tsx"
)

for FILE in "${FILES[@]}"
do
  if [ ! -f "$FILE" ]; then
    echo "⚠️ Archivo faltante: $FILE"
  else
    echo "✅ $FILE existe"
  fi
done

echo "Preparado para ejecutar tests."
