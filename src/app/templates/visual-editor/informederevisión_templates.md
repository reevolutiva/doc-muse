# Plan de Migración y Eliminación de Componentes Legacy

Este plan detalla el proceso sistemático para eliminar los componentes legacy en `/project-templates/` y `/templates/` mientras se mantiene la funcionalidad de React Flow.

## Contexto

- Los directorios `/project-templates/` y `/templates/` contienen componentes legacy que están siendo reemplazados por una implementación con React Flow
- La nueva implementación está ubicada principalmente en `src/app/templates/visual-editor/`
- No se debe migrar código legacy, solo preservar la funcionalidad de React Flow

## Plan para Agente IA

### Fase 1: Inventario y respaldo (1 día)

1. **Crear directorio de respaldo**
```bash
mkdir -p .backup/templates .backup/project-templates
```

2. **Realizar inventario completo de componentes**
```bash
# Crear archivo de inventario
mkdir -p scripts/migration
touch scripts/migration/template-components-inventory.md

# Listar todos los componentes en directorios legacy
find ./project-templates ./templates -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | sort > scripts/migration/template-components-inventory.md

# Listar todos los componentes de React Flow
find ./src -type f -path "*/templates/*" -name "*.ts" -o -name "*.tsx" | grep -i flow >> scripts/migration/template-components-inventory.md
```

3. **CHECKPOINT**: Revisar el inventario generado y actualizar `Docs/features/informederevisión_templates.md` con los hallazgos.

### Fase 2: Identificar y verificar componentes React Flow (1 día)

1. **Localizar componentes de React Flow**
```bash
# Buscar importaciones de React Flow
grep -r "from 'reactflow'" --include="*.tsx" --include="*.ts" ./src
grep -r "from '@reactflow/core'" --include="*.tsx" --include="*.ts" ./src
```

2. **Verificar componentes de React Flow en uso**
```bash
# Crear lista de componentes React Flow
touch scripts/migration/react-flow-components.md
```

3. **CHECKPOINT**: Actualizar `informederevisión_templates.md` con la lista de componentes React Flow verificados.

### Fase 3: Verificar rutas de redirección (1 día)

1. **Comprobar que las redirecciones están implementadas**
```bash
# Verificar redirecciones en app router
grep -r "redirect" --include="*.tsx" --include="*.ts" ./src/app
```

2. **Asegurar que las siguientes redirecciones existen o crearlas:**
   - `/document-templates/` → `/templates`
   - `/project-templates/` → `/templates?tab=projects`

3. **CHECKPOINT**: Actualizar `informederevisión_templates.md` con el estado de las redirecciones.

### Fase 4: Respaldo y eliminación gradual (2 días)

1. **Crear respaldo de código legacy**
```bash
# Respaldar componentes legados
cp -r ./project-templates/* .backup/project-templates/
cp -r ./templates/* .backup/templates/
```

2. **Eliminar directorios legacy en bloques controlados**
```bash
# Eliminar primero componentes no críticos de /templates/
rm -rf ./templates/utils ./templates/components ./templates/hooks

# Actualizar rutas en importaciones afectadas por la eliminación
grep -r "from 'templates/" --include="*.tsx" --include="*.ts" ./src

# CHECKPOINT tras primer bloque de eliminaciones
```

3. **Completar eliminación**
```bash
# Eliminar directorios completos
rm -rf ./project-templates
rm -rf ./templates
```

4. **CHECKPOINT**: Actualizar `informederevisión_templates.md` confirmando la eliminación y cualquier problema encontrado.

### Fase 5: Pruebas de regresión (1 día)

1. **Ejecutar pruebas automatizadas**
```bash
pnpm test
```

2. **Comprobar funcionalidad en desarrollo**
```bash
pnpm dev
```

3. **Verificar las rutas principales:**
   - `/templates` (debe mostrar interfaz React Flow)
   - `/templates/visual-editor` (debe funcionar correctamente)
   - Rutas antiguas (deben redirigir correctamente)

4. **CHECKPOINT**: Actualizar `informederevisión_templates.md` con los resultados de las pruebas.

### Fase 6: Consolidación de documentación (1 día)

1. **Unificar documentos de requisitos**
```bash
# Crear nuevo documento unificado
touch Docs/unified_templates.md
```

2. **Consolidar contenido de los documentos antiguos**
   - Integrar contenido de `Docs/rfp_templates.md` y `Docs/roadmap_templates.md`
   - Eliminar información obsoleta sobre componentes legacy
   - Actualizar referencias a las nuevas rutas y componentes

3. **Actualizar el archivo de arquitectura**
```bash
# Eliminar referencias a directorios eliminados en arquitectura.md
sed -i '' '/project-templates\//d' Docs/arquitectura.md
```

4. **CHECKPOINT**: Actualizar `informederevisión_templates.md` confirmando la unificación de la documentación.

### Fase 7: Verificación final y cierre (1 día)

1. **Comprobar build de producción**
```bash
pnpm build
```

2. **Verificar con Docker**
```bash
docker compose up
```

3. **Actualización final de `informederevisión_templates.md`**:
   - Actualizar sección "Estado Actual de la Implementación"
   - Actualizar sección "Próximos Pasos" eliminando elementos completados
   - Añadir nueva sección "Migración Completada" con fecha y resumen

4. **Cerrar tarea de migración y eliminación**

## Recomendaciones 

- Ejecutar la eliminación de componentes en un entorno de desarrollo aislado antes de aplicar a la rama principal
- Realizar commits frecuentes durante el proceso
- Mantener el directorio `.backup` durante al menos una semana después de la migración
