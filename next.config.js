/** @type {import("next").NextConfig} */
      const config = {
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
          config.stats = "verbose";
          return config;
        },
        // output: "export" <- Eliminado para permitir SSR y next start
      };
      export default config;