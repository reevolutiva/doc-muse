## Inicialización del Contenedor en Modo Desarrollo

### Configuración de Docker
El proyecto utiliza Docker para gestionar el entorno de desarrollo. La configuración principal se encuentra en los archivos `docker-compose.yml` y `Dockerfile`.

1. **Archivo `docker-compose.yml`:**
   - Define los servicios `app` (aplicación) y `supabase-db` (base de datos de Supabase).
   - El servicio `app` expone el puerto `3000` para la aplicación.
   - La URL de Supabase está configurada como `http://host.docker.internal:54321` para asegurar la conectividad desde el contenedor.

2. **Archivo `Dockerfile`:**
   - El objetivo `dev` está configurado para iniciar el servidor de desarrollo con `pnpm dev`.

### Comandos para Inicializar
1. Construir y levantar los contenedores:
   ```bash
   docker-compose up --build
   ```
2. Acceder a la aplicación en el navegador:
   - URL: [http://localhost:3000](http://localhost:3000)

### Depuración
Si encuentras problemas:
1. Verifica los logs del contenedor:
   ```bash
   docker-compose logs app
   ```
2. Asegúrate de que las variables de entorno en `.env.local` estén configuradas correctamente.
3. Reinicia los contenedores:
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```
