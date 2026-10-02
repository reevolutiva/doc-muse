# Doc-Muse

Doc-Muse es una aplicación para gestión y generación de documentos, construida con Next.js, Supabase y una arquitectura moderna de componentes.

## 📋 Tabla de Contenido

- [Introducción](#introducción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
  - [Requisitos Previos](#requisitos-previos)
  - [Script de Configuración Automática](#script-de-configuración-automática)
  - [Configuración de Supabase](#configuración-de-supabase)
  - [Configuración Local](#configuración-local)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
  - [Desarrollo Local](#desarrollo-local)
  - [Despliegue con Docker](#despliegue-con-docker)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Licencia](#licencia)

## 🚀 Introducción

Doc-Muse es una plataforma que permite a los usuarios crear, gestionar y generar documentos a partir de plantillas personalizables. La aplicación está diseñada para facilitar la creación de documentos estructurados utilizando inteligencia artificial y un flujo de trabajo optimizado para diferentes tipos de proyectos.

## 🏗️ Estructura del Proyecto

La arquitectura del proyecto está organizada de la siguiente manera:

```
doc-muse/
├── public/              # Archivos estáticos
├── src/                 # Código fuente principal
│   ├── app/             # Rutas y páginas de la aplicación (Next.js App Router)
│   ├── components/      # Componentes React reutilizables
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Funciones de utilidad y configuración
│   │   ├── supabase.ts  # Cliente y configuración de Supabase
│   │   ├── types/       # Definiciones de tipos
│   │   └── utils/       # Funciones de utilidad
│   ├── styles/          # Estilos globales
│   └── types/           # Tipos globales de TypeScript
├── supabase/            # Funciones y configuración de Supabase
│   ├── functions/       # Funciones Edge de Supabase
│   └── config.toml      # Configuración de Supabase
└── vscode/              # Configuración de VS Code
```

- `src/`: Contiene los componentes, hooks, y lógica principal de la aplicación.
- `supabase/`: Configuración y funciones relacionadas con Supabase.
- `public/`: Archivos estáticos.
- `styles/`: Archivos de estilos globales.
- `next.config.js`: Configuración de Next.js.
- `package.json`: Dependencias y scripts del proyecto.

## 🔧 Configuración del Entorno de Desarrollo

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para despliegue con contenedores)
- Cuenta en [Supabase](https://supabase.com/)

### Script de Configuración Automática

Para facilitar la configuración del entorno de desarrollo, puedes utilizar nuestro script automatizado:

```bash
# Dar permisos de ejecución al script
chmod +x scripts/setup-dev-env.sh

# Ejecutar el script
./scripts/setup-dev-env.sh
```

Este script guía a través del proceso completo de configuración, incluyendo:
- Clonación del repositorio
- Configuración de Supabase
- Instalación de dependencias
- Configuración de Docker (opcional)
- Inicio del servidor de desarrollo

### Configuración de Supabase

1. **Clonar el repositorio de Kimfe**

   ```bash
   git clone https://github.com/kimfe/doc-muse.git
   cd doc-muse
   ```

2. **Crear un proyecto en Supabase**

   - Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Crear una nueva organización (si no tienes una)
   - Crear un nuevo proyecto dentro de esa organización
   - Toma nota de la URL y la clave anónima (API Key) del proyecto

3. **Configurar las variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
   ```

4. **Inicializar la base de datos de Supabase**

   - En el dashboard de Supabase, ve a la sección SQL Editor
   - Importa y ejecuta los scripts SQL necesarios para crear las tablas y funciones requeridas
   - Puedes encontrar estos scripts en `supabase/migrations/` si están disponibles

5. **Configurar las funciones Edge de Supabase (opcional)**

   Si necesitas usar las funciones serverless de Supabase:

   ```bash
   supabase functions deploy --project-ref tu-referencia-de-proyecto
   ```

### Configuración Local

1. **Instalar dependencias**

   ```bash
   pnpm install
   ```

2. **Preparar los archivos de configuración**

   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales de Supabase
   ```

3. **Configurar variables de entorno en un archivo `.env.local`**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 🚀 Ejecución del Proyecto

### Política de secretos y respuesta a incidentes

- Guarda credenciales únicamente en `.env.local` (Supabase CLI/Docker local) o en el gestor de secretos del proveedor. Los archivos `.env*` se ignoran, salvo `.env.example`, que debe contener solo placeholders.
- Nunca incluyas claves privadas, contraseñas, tokens de acceso ni `service_role` en código, documentación, imágenes, logs o artefactos. Solo URL y claves públicas `anon`/publishable pueden usar `NEXT_PUBLIC_*`; revisa RLS antes de exponerlas.
- El cliente Etherpad ya no envía una clave API. El operador del middleware debe almacenar la credencial rotada en servidor y autenticar/autorizar cada operación sobre pads; hasta provisionarlo, las operaciones pueden ser rechazadas. No restaures la clave en el navegador ni expongas un proxy sin control de acceso.
- Instala [Gitleaks](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1) desde su distribución oficial y verifica el checksum de tu plataforma. Activa el hook con `git config core.hooksPath .githooks` después de `pnpm install`. Si ya tienes hooks locales, integra el escaneo sin eliminarlos. El hook bloquea commits si falta el escáner, escanea el índice y conserva `lint-staged`.
- CI ejecuta **Secret scan / secrets** en pushes, PRs, manualmente y diariamente, con redacción completa y sin publicar informes. Un administrador debe exigir este check en la protección de ramas y habilitar secret scanning/push protection en GitHub. No se omiten hallazgos históricos con una baseline.
- `.gitleaks.toml` extiende las reglas oficiales e incluye claves serializadas en notebooks. Las excepciones deben limitarse a formatos y rutas de datos de prueba comprobados; nunca añadas una excepción para una credencial comprometida.
- Antes de compartir cambios, ejecuta `gitleaks dir . --redact=100 --ignore-gitleaks-allow` y `gitleaks git . --log-opts="--all" --redact=100 --ignore-gitleaks-allow`. Un escaneo sin hallazgos no demuestra ausencia de secretos; revisa también credenciales no reconocidas, releases, artefactos y logs.

**Si se detecta exposición:** trátala como comprometida, pausa despliegues y notifica al responsable por un canal privado. Inventaría solo proveedor, ruta, commit, identificador no sensible y alcance; nunca copies el valor a un issue público.

1. Revoca primero en el proveedor, crea credenciales nuevas de mínimo privilegio, actualiza gestores de secretos y `.env.local`, redespliega y confirma que las anteriores ya no autentican. Para Supabase distingue el entorno Docker local del proyecto remoto: rota contraseñas de base de datos, secretos JWT y claves privilegiadas afectados; coordina la invalidación de sesiones y las claves dependientes. Revisa también proveedores de IA, correo y tokens de GitHub identificados en la auditoría.
2. Conserva evidencia privada: UTC, responsable, ID del evento de revocación/rotación y resultado de la verificación (sin valores). Revisa actividad, facturación y accesos durante la ventana de exposición. No declares una rotación ejecutada sin esa evidencia.
3. Tras rotar, un administrador debe coordinar la limpieza con `git-filter-repo` en una copia aislada con todas las ramas y tags afectados, respaldo privado y publicación congelada. Elimina rutas sensibles o reemplaza valores también en archivos renombrados y mensajes de commit; vuelve a escanear antes de actualizar refs con autorización. Esta limpieza no se resuelve con un commit que borre archivos y requiere una operación administrativa separada de esta rama.
4. Solicita a GitHub la eliminación de referencias/cachés de PR y contenido sensible; elimina artefactos, logs e imágenes afectados y coordina forks y clones (reclonado, sin fusionar historial antiguo). No asumas que reescribir Git elimina copias externas.
5. Registra el timeline, impacto confirmado/desconocido, causa, acciones ejecutadas y pendientes en `Docs/bug_vitacora.md`. Cierra el P0 solo con inventario completo, evidencia de revocación, escaneo del historial saneado y controles exigidos en ramas.

### Desarrollo Local

1. **Iniciar el servidor de desarrollo**

   ```bash
   pnpm dev
   ```

   El servidor estará disponible en `http://localhost:3000`

2. **Ejecutar comprobaciones de tipo y linting**

   ```bash
   pnpm check
   ```

3. **Formatear el código**

   ```bash
   pnpm format:write
   ```

### Despliegue con Docker

1. **Construir la imagen de Docker**

   ```bash
   docker build -t doc-muse .
   ```

2. **Ejecutar el contenedor Docker**

   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your-url -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key doc-muse
   ```

   O utilizando docker-compose:

   ```bash
   docker-compose up
   ```

## Docker Instructions

This application is dockerized. Follow these steps to build and run the Docker container:

1. Build the Docker image:
   docker build -t my-app .

2. Run the Docker container:
   docker run -d -p 3000:3000 my-app

- Updated from Geist to the new font source.

## 🌟 Características Principales

- **Gestión de Documentos**: Crear, editar y organizar documentos
- **Plantillas Personalizables**: Crear y utilizar plantillas para documentos
- **Proyectos**: Organizar documentos en proyectos
- **Editor de Bloques**: Interfaz intuitiva para la edición de documentos
- **Integración con IA**: Generación de contenido asistida por IA
- **Autenticación**: Sistema de autenticación integrado con Supabase

## 🛠️ Tecnologías Utilizadas

- **Frontend**
  - [Next.js](https://nextjs.org/) (React framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) (Estilizado)
  - [Radix UI](https://www.radix-ui.com/) (Componentes accesibles)
  - [Zustand](https://github.com/pmndrs/zustand) (Gestión de estado)

- **Backend**
  - [Supabase](https://supabase.com/) (Base de datos y autenticación)
  - [Edge Functions](https://supabase.com/edge-functions) (Funciones serverless)

- Next.js
- Supabase
- Zustand (o Context API)
- Tailwind CSS
- Radix UI

## 🚀 Ejecución del Proyecto

1. Iniciar el servidor de desarrollo:
    ```bash
    pnpm dev
    ```
2. Construir el proyecto para producción:
    ```bash
    pnpm build
    ```
3. Ejecutar el proyecto en modo producción:
    ```bash
    pnpm start
    ```

## CI/CD

- Configuración para despliegue en Vercel.
- Pipelines de CI/CD configurados en GitHub Actions.

## Testing

- Estrategias de testing con Jest y React Testing Library.

## Contribución

- Guía de estilo de código y linting.
- Cómo contribuir al proyecto.

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.