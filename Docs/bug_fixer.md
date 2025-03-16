# Bug Fixer
## Bug Fixer Instrucciones
- Este documento rastrea bugs y problemas en la aplicación Doc-Muse que necesitan resolución. 
- Cada vez que trabajes sobre un problema, revisa la estructura del proyecto. Nunca dupliques archivos, carpetas ni código, si la estructura cambia, acualizala en este documento al finalizar.
- Al finalizar tu corrección, actualiza la vitácora del problema en este documento el cuál siempre tendrá información actualizada.
- Mantén este fichero liviano y con objetivo de ayudar a agentes IA a resolver problemas. No es necesario que sea comprensible por humnanos. 
- Cuando determines que existe un problema describelo de la forma más efectiva y eficiente posible, replicando o mejorando los ejemplos en este documento.

## Estructura del Repositorio

### Directorios Principales
- **src/**: Código fuente principal de la aplicación
  - **app/**: Rutas y páginas de la aplicación utilizando Next.js App Router
  - **components/**: Componentes React reutilizables
  - **hooks/**: Custom hooks para lógica compartida
  - **lib/**: Funciones de utilidad y configuración
    - **supabase.ts**: Cliente y configuración de Supabase
    - **types/**: Definiciones de tipos TypeScript
    - **utils/**: Funciones de utilidad general
  - **styles/**: Estilos globales

- **supabase/**: Configuración y funciones relacionadas con Supabase
  - **functions/**: Funciones Edge de Supabase (serverless)
  - **migrations/**: Scripts SQL para la inicialización de la base de datos
  - **config.toml**: Configuración del proyecto Supabase

- **public/**: Archivos estáticos accesibles públicamente
- **Docs/**: Documentación del proyecto
- **scripts/**: Scripts de utilidad para desarrollo y despliegue

### Archivos de Configuración
- **next.config.js**: Configuración de Next.js
- **package.json**: Dependencias y scripts del proyecto
- **docker-compose.yml** y **Dockerfile**: Configuración para despliegue con Docker
- **tailwind.config.ts**: Configuración de Tailwind CSS
- **.env.local**: Variables de entorno locales (gitignored)

# Problemas Activos

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
