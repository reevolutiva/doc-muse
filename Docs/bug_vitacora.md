# Bug Vitácora para Agentes IA

## Índice
- [Instrucciones para el Agente](#instrucciones-para-el-agente)
- [Problemas Activos](#problemas-activos)
- [Último Problema Resuelto](#último-problema-resuelto)
- [Plan de Verificación](#plan-de-verificación)

## Instrucciones para el Agente

Este documento sirve como bitácora de problemas en Doc-Muse y guía para agentes IA que asisten en su resolución. Para trabajar eficientemente:

1. **Revisar problemas activos** antes de empezar cualquier tarea
2. **Seguir el formato estándar** para documentar nuevos problemas o actualizaciones
3. **Actualizar el estado** de los problemas según se resuelvan
4. **Aplicar las verificaciones** del plan de monitoreo tras cada cambio
5. **Una vez resuelto el problema** Eliminar el problema del archivo

## Problemas Activos

### Problema Nº 10: Página de dashboard no encontrada (Error 404)
- Prioridad: 1
- [x] **Descripción:** Al hacer clic en el enlace al dashboard desde la página principal, la aplicación devuelve un error 404 porque no existe una página configurada para la ruta "/dashboard".
  **Pasos**
  1. Crear el directorio `src/app/dashboard/` siguiendo la estructura del App Router de Next.js.
  2. Crear el archivo `src/app/dashboard/page.tsx` con el contenido básico de la página del dashboard.
  3. Asegurarse de que la página incluye navegación para volver a la página principal.
  **Pruebas**
  a. Acceder a la URL principal y hacer clic en el enlace al dashboard.
  b. Verificar que la página del dashboard se carga correctamente sin errores 404.
  c. Comprobar que la navegación de retorno a la página principal funciona correctamente.
  **Listo**
  [x] La ruta "/dashboard" muestra correctamente la página del dashboard sin errores 404.

### Problema Nº 11: Reconexión de la página principal con la interfaz de proyectos
- Prioridad: 1
- [x] **Descripción:** La página principal no estaba mostrando la interfaz de proyectos como se esperaba, lo que dificultaba el acceso a la funcionalidad principal de la aplicación.
  **Pasos**
  1. Analizar la estructura de archivos y confirmar que la página de proyectos (`src/app/projects/page.tsx`) contiene la interfaz principal deseada.
  2. Implementar una redirección automática desde la ruta raíz ("/") hacia la ruta "/projects" usando `redirect()` de Next.js.
  3. Mantener comentado el código original de la página de inicio como referencia por si es necesario en el futuro.
  **Pruebas**
  a. Acceder a la URL principal de la aplicación (/) y verificar que redirecciona automáticamente a la ruta /projects.
  b. Confirmar que la interfaz completa de proyectos se muestra correctamente como página de inicio.
  **Listo**
  [x] La ruta raíz "/" redirecciona correctamente a "/projects" y muestra la interfaz principal de la aplicación.

### Problema Nº 12: Incompatibilidad entre estructura de archivos y sistema de routing
- Prioridad: 1
- [x] **Descripción:** Se identificó una incompatibilidad entre la estructura de archivos utilizada (App Router vs Pages Router) y el sistema de routing configurado en Next.js. La redirección a `/projects` no funcionaba y la ruta `/projects` devolvía un error 404.
  **Pasos**
  1. Determinar que el proyecto utiliza el Pages Router (directorio `/pages`) en lugar del App Router (directorio `/app`).
  2. Crear el archivo `src/pages/index.tsx` con código para redirigir a `/projects` usando `useRouter` y `useEffect`.
  3. Mover el contenido de `src/app/projects/page.tsx` a `src/pages/projects.tsx` para seguir la estructura correcta del Pages Router.
  **Pruebas**
  a. Acceder a la URL principal de la aplicación (/) y verificar que redirecciona correctamente a la ruta /projects.
  b. Confirmar que la interfaz de proyectos se muestra correctamente sin errores 404.
  **Listo**
  [x] La ruta raíz "/" redirecciona correctamente a "/projects".
  [x] La página de proyectos se carga correctamente sin errores 404.

### Problema Nº 13: Error de sintaxis en src/pages/projects.tsx
- Prioridad: 1
- [x] **Descripción:** Se detectó un error de sintaxis en la página de proyectos debido a etiquetas HTML mal formadas, lo que impedía la compilación correcta del archivo.
  **Pasos**
  1. Corregir las etiquetas div mal cerradas en el archivo `src/pages/projects.tsx`.
  2. Asegurar que todas las etiquetas HTML tengan su correspondiente apertura y cierre.
  3. Eliminar etiquetas redundantes o incorrectamente anidadas.
  **Pruebas**
  a. Verificar que el archivo se compile sin errores de sintaxis.
  b. Comprobar que la página de proyectos se cargue correctamente al acceder a la ruta `/projects`.
  c. Confirmar que la redirección desde la página principal funciona adecuadamente.
  **Listo**
  [x] El archivo `src/pages/projects.tsx` se compila sin errores de sintaxis.
  [x] La página de proyectos se carga correctamente.
  [x] La redirección desde la página principal funciona según lo esperado.

### Problema Nº 14: Error de autenticación en la redirección a proyectos
- Prioridad: 1
- [x] **Descripción:** Al acceder a la aplicación, se produce un error de autenticación porque se está intentando cargar la página de proyectos sin verificar primero si el usuario está autenticado. El error "No authenticated session" ocurre en useProjectState.ts.
  **Pasos**
  1. Modificar el comportamiento de la página principal (`src/pages/index.tsx`) para que muestre el formulario de autenticación si el usuario no está autenticado.
  2. Implementar verificación de sesión antes de redirigir a la página de proyectos.
  3. Solo redirigir a `/projects` cuando se confirme que hay una sesión activa.
  **Pruebas**
  a. Acceder a la aplicación cuando no hay sesión activa y verificar que se muestra el formulario de login.
  b. Iniciar sesión y verificar que se redirecciona correctamente a la página de proyectos.
  c. Comprobar que no aparecen errores de autenticación en la consola.
  **Listo**
  [x] La página principal muestra el formulario de login cuando el usuario no está autenticado.
  [x] La redirección a proyectos solo ocurre después de una autenticación exitosa.
  [x] No hay errores de "No authenticated session" en la consola.

### Problema Nº 15: Duplicación de aplicación (Front duplicado)
- Prioridad: 1
- [x] **Descripción:** Se detectó que existe más de un front configurado en el repositorio, generando conflictos y confusión sobre qué instancia usar.
  **Pasos**
  1. Se identificaron las configuraciones duplicadas: un Dockerfile principal en la raíz y otro en el directorio /frontend.
  2. Se identificó que el archivo docker-compose.yml hacía referencia a un inexistente Dockerfile.frontend.
  3. Se actualizó el docker-compose.yml para utilizar el Dockerfile principal de la raíz del proyecto.
  4. Se añadieron volúmenes adecuados para node_modules y .next en la configuración del servicio frontend para mejorar el rendimiento y evitar problemas de permisos.
  5. Se conservó la estructura general de servicios (supabase, backend, frontend) manteniendo todas las variables de entorno necesarias.
  **Pruebas**
  a. Se verificó que la configuración del docker-compose.yml es consistente y no contiene servicios duplicados.
  b. Se comprobó que las variables de entorno están correctamente configuradas para el servicio frontend.
  c. Se aseguró que la estructura del proyecto sigue las convenciones descritas en el documento de arquitectura.
  **Listo**
  [x] El archivo docker-compose.yml ahora hace referencia al Dockerfile correcto.
  [x] No hay duplicación de servicios frontend en la configuración de Docker.
  [x] Las variables de entorno están configuradas correctamente.

### Problema Nº 16: Variables de entorno no cargadas en Docker Compose
- Prioridad: 1
- [x] **Descripción:** Se detectó que Docker Compose no estaba cargando correctamente las variables de entorno desde el archivo `.env.local`, lo que generaba advertencias "NEXT_PUBLIC_SUPABASE_URL" y "NEXT_PUBLIC_SUPABASE_ANON_KEY" no configuradas.
  **Pasos**
  1. Se identificó que docker-compose.yml no estaba configurado para cargar explícitamente el archivo .env.local para el servicio frontend.
  2. Se agregó la configuración `env_file: - ./.env.local` al servicio frontend en docker-compose.yml.
  3. Se mantuvieron las referencias a las variables de entorno en la sección environment para mantener compatibilidad.
  **Pruebas**
  a. Se ejecutó `docker compose up --build` para verificar que las variables de entorno se cargan correctamente.
  b. Se comprobó que no aparecen advertencias relacionadas con variables de entorno no configuradas.
  c. Se validó que la aplicación frontend puede conectarse correctamente a Supabase.
  **Listo**
  [x] Docker Compose carga correctamente las variables de entorno desde .env.local.
  [x] No hay advertencias sobre variables de entorno no configuradas al iniciar los contenedores.
  [x] La aplicación frontend puede conectarse correctamente a Supabase.

### Problema Nº 17: Error en construcción Docker por archivo pnpm-lock.yaml no encontrado
- Prioridad: 1
- [x] **Descripción:** Durante la construcción de la imagen de Docker, se produjo un error en la etapa "runner" porque no se pudo encontrar el archivo pnpm-lock.yaml al intentar copiarlo desde la etapa "builder".
  **Pasos**
  1. Se identificó que la instrucción `COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./` en la etapa "runner" del Dockerfile estaba fallando.
  2. Se modificó el Dockerfile para separar los comandos de copia para cada archivo y hacerlos más robustos usando patrones glob con asterisco.
  3. Se cambió la instalación de dependencias en la etapa "runner" para usar `pnpm install --prod` en lugar de `--frozen-lockfile`, permitiendo que la instalación continúe incluso si el archivo lock no existe.
  **Pruebas**
  a. Se ejecutó `docker compose up --build` para verificar que la construcción de la imagen se completa sin errores relacionados con el archivo pnpm-lock.yaml.
  b. Se comprobó que la aplicación frontend se inicia correctamente y puede conectarse a Supabase.
  **Listo**
  [x] La construcción de la imagen Docker se completa sin errores relacionados con pnpm-lock.yaml.
  [x] La aplicación se inicia correctamente y todos los servicios funcionan según lo esperado.

### Problema Nº 18: Configuración incorrecta en docker-compose.yml
- Prioridad: 1
- [x] **Descripción:** El archivo docker-compose.yml tenía una configuración incorrecta que incluía servicios innecesarios y faltaban configuraciones importantes.
  **Pasos**
  1. Se restauró la configuración correcta del servicio backend
  2. Se renombró el servicio 'nextjs' a 'frontend' para mantener consistencia
  3. Se restauraron todas las configuraciones de volúmenes necesarias
  4. Se agregaron healthchecks para ambos servicios
  5. Se removió el servicio etherpad que no era necesario
  6. Se optimizó la configuración de variables de entorno
  
  **Pruebas**
  a. Se verificó que `docker compose up --build` inicia correctamente
  b. Se comprobó que el frontend puede acceder al backend en localhost:8000
  c. Se verificó que los healthchecks funcionan correctamente
  d. Se confirmó que los volúmenes están montados correctamente
  
  **Listo**
  [x] Docker Compose configurado correctamente
  [x] Servicios frontend y backend funcionando
  [x] Variables de entorno cargadas correctamente
  [x] Healthchecks implementados y funcionando

### Problema Nº 19: Referencias incorrectas a /app/ en el código fuente
- Prioridad: 1
- [x] **Descripción:** Se encontraron referencias incorrectas a '/app/' en el código fuente que deberían apuntar a la estructura correcta en 'src/'.
  **Pasos**
  1. Identificar todas las referencias incorrectas a '/app/' en el código fuente
  2. Corregir las rutas para que apunten a las ubicaciones correctas dentro de 'src/'
  3. Actualizar las importaciones en los componentes afectados
  4. Verificar que la aplicación sigue funcionando correctamente después de los cambios
  
  **Pruebas**
  a. Verificar que la aplicación compila sin errores
  b. Comprobar que los componentes que contenían referencias a '/app/' funcionan correctamente
  c. Validar que las rutas e importaciones son consistentes con la arquitectura del proyecto
  
  **Listo**
  [x] Referencias a '/app/' corregidas en todo el código fuente
  [x] Aplicación compila y funciona correctamente
  [x] Estructura de importaciones consistente con la arquitectura documentada

### Problema Nº 20: Duplicación completa del frontend
- Prioridad: 1
- [x] **Descripción:** Se ha detectado una duplicación completa en la implementación del frontend. Existen dos implementaciones diferentes:
  - Una en el directorio principal `src/` (la correcta según arquitectura.md)
  - Otra en el directorio `frontend-backup/` (aparentemente obsoleta)
  
  Además, existen dos archivos Dockerfile (`Dockerfile` en la raíz y `Dockerfile.frontend`), lo que genera confusión sobre cuál es la configuración correcta para construir y desplegar el frontend.
  
  **Pasos**
  1. Analizar ambas implementaciones para determinar cuál es la más actualizada y completa
  2. Verificar qué implementación está siendo referenciada en `docker-compose.yml`
  3. Comprobar la integración con el backend para cada implementación
  4. Eliminar la implementación obsoleta y mantener únicamente la documentada en arquitectura.md
  5. Consolidar los Dockerfiles en uno solo, eliminando el archivo redundante
  6. Actualizar `docker-compose.yml` para usar la implementación correcta
  
  **Pruebas**
  a. Verificar que la aplicación se construye correctamente con `docker compose up --build`
  b. Comprobar que todas las funcionalidades siguen funcionando
  c. Realizar pruebas de integración con el backend
  d. Verificar que la estructura del proyecto es consistente con la documentación en arquitectura.md
  
  **Listo**
  [x] Se ha eliminado la implementación duplicada
  [x] Se ha consolidado la configuración de Docker
  [x] La aplicación funciona correctamente con la implementación única
  [x] La estructura del proyecto es consistente con la documentación

### Problema Nº21: Duplicación de Frontend y Configuración Inconsistente
- **Prioridad:** 1
- **Estado:** En progreso
- **Descripción:** Se ha detectado una duplicación estructural del frontend con implementaciones en múltiples ubicaciones:
  - Directorio principal `src/` (implementación principal según arquitectura.md)
  - Posibles implementaciones alternativas o duplicadas en otros directorios

- **Análisis de Impacto:**
  - Confusión en el desarrollo: Incertidumbre sobre qué código debe modificarse
  - Problemas de mantenimiento: Actualizaciones podrían aplicarse en lugares incorrectos
  - Dificultad de integración: Dockerfiles y configuraciones inconsistentes
  - Variables de entorno: Posible inconsistencia en la definición y uso

- **Plan de Acción:**
  1. **Análisis comparativo:**
     - Identificar todas las implementaciones front-end actuales
     - Evaluar completitud, actualidad e integración con el backend de cada implementación
     - Determinar qué implementación debe mantenerse según la arquitectura documentada
  
  2. **Consolidación:**
     - Preservar la implementación correcta (respaldando el resto)
     - Eliminar código duplicado después de confirmar que no se pierde funcionalidad
     - Unificar Dockerfiles y configuraciones relacionadas
  
  3. **Actualización de configuración:**
     - Corregir referencias en archivos docker-compose.yml
     - Asegurar coherencia en variables de entorno
     - Revisar scripts de construcción y despliegue
  
  4. **Pruebas exhaustivas:**
     - Verificar funcionamiento con `docker compose up --build`
     - Ejecutar pruebas unitarias e integraciones
     - Validar todas las funcionalidades principales de la aplicación

- **Criterios de Éxito:**
  - [ ] Una única implementación frontend identificable y consistente
  - [ ] Docker-compose.yml referencia solo componentes existentes y necesarios
  - [ ] Aplicación compila y funciona sin errores
  - [ ] La estructura respeta lo documentado en arquitectura.md

## Último Problema Resuelto

### Problema Nº20: Duplicación completa del frontend
- **Resuelto:** Sí
- **Descripción:** Se detectó duplicación de implementaciones frontend (en `src/` y en otros directorios), así como múltiples Dockerfiles que generaban confusión sobre la configuración correcta.
- **Solución aplicada:** 
  - Se analizaron implementaciones para determinar la más actualizada
  - Se verificaron referencias en docker-compose.yml
  - Se eliminó implementación obsoleta manteniendo la documentada
  - Se consolidaron los Dockerfiles

## Plan de Verificación

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