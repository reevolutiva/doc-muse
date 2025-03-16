export const config = {
  // Deshabilitar la generación estática para las rutas dinámicas
  dynamic: 'force-dynamic',
  // Configuración de la caché
  revalidate: 0,
  // Configurar el middleware de autenticación
  matcher: ['/templates/:path*']
};