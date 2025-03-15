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

## 🚀 Ejecución del Proyecto

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

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.