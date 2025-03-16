/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
    // Habilitar características experimentales necesarias
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
  webpack: (config, { isServer }) => {
    // Configuración específica para el servidor
    if (isServer) {
      // Manejar módulos que deben ser externos en el servidor
      config.externals = [...(config.externals || []), '@supabase/supabase-js']
    }
    
    // Añadir soporte para CSS modules
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    })

    // Ensure custom CSS configuration does not conflict with Next.js built-in CSS support
    config.stats = undefined // Remove "verbose" to avoid disabling built-in CSS support
    return config;
  },
  // Configuración de páginas y módulos
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  staticPageGenerationTimeout: 120,
  compiler: {
    styledComponents: true,
  },
}

export default nextConfig;