/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
    // Habilitar Turbopack para desarrollo
    turbo: {
      loaders: {
        // Configurar loaders específicos si es necesario
        '.css': ['style-loader', 'css-loader'],
      },
    },
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Usar webpack solo si no estamos en modo de desarrollo o si Turbopack no está disponible
    if (!dev) {
      // Configuración específica para el servidor
      if (isServer) {
        config.externals = [...(config.externals || []), '@supabase/supabase-js']
      }
      
      // Añadir soporte para CSS modules
      // config.module.rules.push({
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // })

      // Ensure custom CSS configuration does not conflict with Next.js built-in CSS support
      config.stats = undefined // Remove "verbose" to avoid disabling built-in CSS support
    }
    return config;
  },
  // Configuración de páginas y módulos
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  staticPageGenerationTimeout: 120,
  compiler: {
    styledComponents: true,
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
  // Ensure Next.js listens on all interfaces
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
}

// Cambiamos de module.exports a export default para compatibilidad con ES modules
export default nextConfig