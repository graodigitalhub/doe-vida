import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Doe Vida — Conectando Corações para Salvar Vidas',
    short_name: 'Doe Vida',
    description: 'Plataforma comunitária para divulgação de pedidos urgentes de doação de sangue e geração de cards de compartilhamento.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#DC2626',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
