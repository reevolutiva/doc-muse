# 🚀 Doc-Muse

## Descripción del Proyecto

Doc-Muse es una aplicación web para la gestión y edición de documentos que permite a los usuarios trabajar con proyectos documentales de manera eficiente. La aplicación utiliza Next.js en el frontend y Supabase como backend para el almacenamiento de datos y autenticación.

Basado en Supabase:
[Video Tutorial de como traer la data repomota de Supabase a local](https://www.youtube.com/watch?v=N0Wb85m3YMI)

## Estructura del Proyecto

```
doc-muse/
├── src/                  # Código fuente de la aplicación
│   ├── app/              # Carpetas de rutas de Next.js App Router
│   ├── components/       # Componentes reutilizables
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilidades y funciones auxiliares
│   ├── styles/           # Estilos globales y temas
│   └── types/            # Definiciones de tipos TypeScript
├── public/               # Archivos estáticos
├── supabase/             # Configuración de Supabase y funciones
└── ...                   # Archivos de configuración del proyecto
```

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/installation) o [bun](https://bun.sh/) como gestor de paquetes
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started) (para Supabase local)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Configuración del Entorno de Desarrollo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/doc-muse.git
cd doc-muse
```

### 2. Instalar Dependencias

Usando pnpm:
```bash
pnpm install
```

O usando bun:
```bash
bun install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
```

### 4. Configurar Supabase Local

#### Instalar la CLI de Supabase
```bash
# Usando npm
npm install -g supabase

# Usando pnpm
pnpm add -g supabase

# Usando bun
bun install -g supabase
```

#### Iniciar Supabase Local
```bash
# Desde la carpeta del proyecto
supabase start
```

Este comando iniciará los servicios de Supabase en contenedores Docker locales y te proporcionará las URL y claves para conectarte.

> **Nota**: Si es la primera vez que ejecutas Supabase localmente, el proceso puede tardar unos minutos mientras se descargan las imágenes de Docker.

#### Aplicar las Migraciones (si existen)
```bash
supabase db reset
```

### 5. Iniciar el Servidor de Desarrollo

```bash
# Usando pnpm
pnpm dev

# Usando bun
bun run dev
```

El servidor de desarrollo estará disponible en [http://localhost:3000](http://localhost:3000).

## Flujo de Trabajo con Git

1. **Crea una nueva rama para tu feature o fix**:
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

2. **Realiza commits frecuentes con mensajes descriptivos**:
   ```bash
   git add .
   git commit -m "feat: agregar funcionalidad de edición de documentos"
   ```

3. **Sube tu rama al repositorio remoto**:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

4. **Crea un Pull Request** desde GitHub para integrar tus cambios a la rama principal.

## Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Compila la aplicación para producción
- `pnpm start`: Inicia la versión compilada
- `pnpm lint`: Ejecuta el linter para verificar la calidad del código

## Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Tutorial de Supabase](https://www.youtube.com/watch?v=N0Wb85m3YMI)

## Licencia

[MIT](LICENSE)