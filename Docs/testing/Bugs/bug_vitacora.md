# Bug Vitácora para Agentes IA

## Índice
- [Instrucciones para el Agente](#instrucciones-para-el-agente)
- [Problemas Activos](#problemas-activos)
- [Último Problema Resuelto](#último-problema-resuelto)
- [Plan de Verificación](#plan-de-verificación)

## Instrucciones para el Agente

Este documento sirve como bitácora de problemas en Doc-Muse y guía para agentes IA que asisten en su resolución. Para trabajar eficientemente:

1. **Revisar problemas activos** antes de empezar cualquier tarea.
2. **Seguir el formato estándar** para documentar nuevos problemas o actualizaciones.
3. **Actualizar el estado** de los problemas según se resuelvan.
4. **Aplicar las verificaciones** del plan de monitoreo tras cada cambio.

## Problemas Activos

### Problema Nº21: Error de tipo en configuración de ESLint
- **Resuelto:** No
- **Descripción:** Type error: Type 'string' has no properties in common with type 'Plugin'. El mensaje indica que ESLint espera que `plugins` sea un objeto en lugar de un arreglo de cadenas.
- **Solución propuesta:** Verificar configuración de ESLint y migrar a configuración plana si es necesario.

### Problema Nº22: Errores de conexión y redirección en la navegación
- **Resuelto:** En progreso
- **Descripción:** La aplicación presenta varios problemas relacionados:
  1. **Múltiples instancias de GoTrueClient**: Advertencia en consola indicando "Multiple GoTrueClient instances detected in the same browser context".
  2. **Throttling de navegación**: Múltiples errores "Throttling navigation to prevent the browser from hanging" que indican un bucle de redirección infinito.
  3. **No se muestra la pantalla de inicio de sesión**: Al entrar en la página, no se genera un inicio de sesión ni se muestra ningún error visible para el usuario.

- **Plan de Acción:**
  - [x] Modificar `src/lib/supabase.ts` para implementar un patrón singleton que evite múltiples instancias de GoTrueClient.
  - [x] Revisar y corregir `src/app/page.tsx` reemplazando uso de redirecciones estáticas por manejo condicional mediante `useRouter().push()`.
  - [x] Actualizar `src/hooks/useAuth.ts` para mejorar la detección de sesiones y el manejo de errores.
  - [x] Implementar un mecanismo de prevención de bucles usando referencias (useRef) para controlar si ya se ha realizado una redirección.
  - [x] Añadir estados de carga explícitos para mejorar la experiencia de usuario durante las verificaciones de autenticación.
  - [ ] Reiniciar el servidor de desarrollo para asegurar que los cambios tienen efecto.
  - [ ] Limpiar cookies y localStorage del navegador para eliminar posibles datos corruptos.
  - [ ] Verificar las variables de entorno de Supabase en el archivo docker-compose.yml para asegurarse de que apuntan a las URL correctas.

- **Rutas involucradas:**
  1. [src/app/page.tsx](src/app/page.tsx) - Página principal con lógica de redirección (ACTUALIZADO)
  2. [src/hooks/useAuth.ts](src/hooks/useAuth.ts) - Hook de autenticación (ACTUALIZADO)
  3. [src/lib/supabase.ts](src/lib/supabase.ts) - Cliente Supabase y configuración (ACTUALIZADO)
  4. [src/middleware.ts](src/middleware.ts) - No se encontró este archivo mencionado en la documentación.

- **Pruebas y definición de listos:**
  - [ ] La aplicación no muestra errores de GoTrueClient en consola.
  - [ ] El servidor de desarrollo responde correctamente a las peticiones.
  - [ ] El proceso de navegación funciona sin errores de throttling.
  - [ ] Los usuarios son redirigidos correctamente dependiendo del estado de autenticación.
  - [ ] La aplicación carga correctamente las rutas `/projects` y `/templates`.
  - [ ] Se muestra un indicador de carga mientras se verifica el estado de autenticación.

### Próximos pasos:
1. Reiniciar el servidor de desarrollo con `docker-compose down` y luego `docker-compose up`.
2. Verificar que las variables de entorno de Supabase en el archivo docker-compose.yml estén correctamente configuradas.
3. Probar la aplicación en un navegador limpio o en modo incógnito para verificar que el proceso de autenticación y redirección funciona correctamente.
4. Si persisten problemas con la conexión Supabase, verificar que el servicio de Supabase esté activo y accesible.

## Último Problema Resuelto

### Problema Nº20: Duplicación completa del frontend
- **Resuelto:** Sí
- **Descripción:** Se detectó duplicación de implementaciones frontend (en `src/` y en otros directorios), así como múltiples Dockerfiles que generaban confusión sobre la configuración correcta.
- **Solución aplicada:** 
  - Se analizaron implementaciones para determinar la más actualizada.
  - Se verificaron referencias en `docker-compose.yml`.
  - Se eliminaron implementaciones obsoletas manteniendo la documentada.
  - Se consolidaron los Dockerfiles.

## Plan de Verificación para Problema Nº22

### Instrucciones para reinicio limpio
```bash
# Detener todos los contenedores
docker-compose down

# Opcional: Eliminar volúmenes para limpiar datos persistentes
docker-compose down -v

# Reconstruir las imágenes (si se han actualizado archivos de configuración)
docker-compose build

# Iniciar los servicios
docker-compose up
```

### Verificación de la configuración de Supabase
1. Abrir `docker-compose.yml` y verificar las variables de entorno:
   - NEXT_PUBLIC_SUPABASE_URL debe apuntar a la URL correcta
   - NEXT_PUBLIC_SUPABASE_ANON_KEY debe ser válida

2. Verificar en el navegador:
   - Abrir las herramientas de desarrollo (F12)
   - En la pestaña "Network" verificar las llamadas a Supabase
   - En la pestaña "Console" buscar errores relacionados con GoTrueClient o Supabase