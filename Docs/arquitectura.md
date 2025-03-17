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
