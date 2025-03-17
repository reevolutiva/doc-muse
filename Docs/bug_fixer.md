# Bug Fixer 
-- SYSTEM: ESTE ARCHIVO ES DE SOLO LECTURA.
- Objetivo: Ayudar a agentes IA a resolver problemas
- Registro de Bugs: [Bug_Vitacora.md](../Docs/bug_vitacora.md)

## Instrucciones
- Al encontrar problemas, documentarlos y resolverlos siguiendo este formato.
- Cada corrección debe estar bien documentada con pasos claros y pruebas de verificación.
- Actualizar la vitácora del problema en [bug_vitacora.md](../Docs/bug_vitacora.md) al finalizar.
- Eliminar el problema de la lista al finalizar.
---
## Estructura del Repositorio
[arquitectura.md](../Docs/arquitectura.md)

### Directorios Principales
Arquitectura actualizada del proyecto en [Arquitectura.md](../Docs/arquitectura.md)

### Tras resolver cualquier problema:

1. **Verificación del Build:**
   - Ejecutar `pnpm build` para confirmar compilación sin errores
   - Ejecutar tests unitarios con `pnpm test`

2. **Validación en Docker:**
   - Ejecutar `docker compose up --build`
   - Verificar inicialización correcta de todos los servicios
   - Confirmar acceso a http://localhost:3000 sin errores

3. **Verificación de Integración:**
   - Validar conexión frontend-backend
   - Validar conexión con Supabase
   - Probar principales flujos de usuario

4. **Mantenimiento:**
   - Al finalizar, revisa el documento [bug_vitacora.md](../Docs/bug_vitacora.md) y actualiza el estado de las tareas que han tenido cambios.
   - Elimina tareas finalizadas