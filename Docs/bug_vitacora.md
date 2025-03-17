# Bug vitácora

 Problemas Activos

## Problemas Nº 5: Advertencia sobre CSS en Next.js
- Prioridad: 2
- [ ] **Descripción:** Next.js advierte que se ha deshabilitado el soporte built-in para CSS debido a la configuración personalizada.
  **Pasos**
  1. Consultar la documentación de Next.js sobre la advertencia de CSS deshabilitado.
  2. Verificar la configuración de PostCSS o Tailwind.
  **Pruebas**
  a. Asegurarse de que la configuración de CSS personalizada funciona correctamente.
  **Listo**
  [] Verificar que no haya advertencias sobre CSS en la compilación.

## Problemas Nº 6: Error en las importaciones y prerenderizado
- Prioridad: 1
- [ ] **Descripción:** El archivo de índice de hooks en `src/lib/hooks/templates/index.ts` no está exportando correctamente `useTemplateLoader` y `useTemplates`. Además, hay un error de prerenderización en la página "/_not-found".
  **Pasos**
  1. Actualizar las rutas de exportación en `src/lib/hooks/templates/index.ts`.
  2. Asegurarse de que `className` esté definido en el componente de la página de error `_not-found`.
  3. Ejecutar `pnpm build` y `docker compose up --build` para verificar los cambios.
  **Pruebas**
  a. Verificar que las importaciones de `useTemplateLoader` y `useTemplates` funcionen correctamente.
  b. Asegurarse de que la página de error se prerenderice sin errores.
  **Listo**
  [] Verificar que las importaciones y la prerenderización funcionen correctamente.


# Plan de Monitoreo y Validación Continua

Para garantizar que el sistema se mantiene estable y detectar rápidamente cualquier nuevo problema:

## Plan de Verificación

- **Ejecución de Build y Pruebas:**  
  Ejecutar `pnpm build` y correr los tests unitarios y de integración regularmente para verificar que la compilación esté libre de errores.

- **Ejecución en Entorno Docker:**  
  Desplegar la aplicación mediante `docker compose up --build` para confirmar que el entorno (incluyendo Supabase y la configuración de Next.js) funcione correctamente.

- **Verificación Manual:**  
  Revisar de manera manual las funcionalidades críticas periódicamente (manejo de errores, renderizado condicional, carga de variables de entorno, etc.).

## Procedimientos de Prevención

- **Actualización Continua:**  
  Mantener este documento actualizado con cualquier nuevo problema detectado. Establecer un ciclo de revisión semanal para garantizar que cualquier bug se identifique y resuelva rápidamente.

## Reporte de Nuevos Bugs

Si se detecta un nuevo problema:
1. Documentarlo en este archivo con una descripción detallada y pasos para reproducirlo
2. Asignar una prioridad (1-Alta, 2-Media, 3-Baja, 4-Mejora)
3. Planificar tareas específicas para su solución
4. Actualizar el estado conforme se avanza en la resolución

---

**Estado actual:** ✅ Sistema estable - Sin problemas pendientes
**Última verificación:** 16 de marzo, 2025
