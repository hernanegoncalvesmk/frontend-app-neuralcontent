/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, // Habilitando otimização de imagens
    domains: ['localhost'], // Permitindo localhost para desenvolvimento
  },
  // Configuração para servir arquivos estáticos corretamente
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/images/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
