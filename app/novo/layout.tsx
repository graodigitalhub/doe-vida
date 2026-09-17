import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Pedido de Doação de Sangue — Doe Vida',
  description: 'Cadastre um pedido urgente de doação de sangue em poucos minutos e gere cards automáticos para compartilhar no WhatsApp e redes sociais.',
  alternates: {
    canonical: '/novo',
  },
  openGraph: {
    title: 'Criar Pedido de Doação de Sangue — Doe Vida',
    description: 'Cadastre um pedido urgente de doação de sangue em poucos minutos e gere cards automáticos para compartilhar no WhatsApp e redes sociais.',
    url: 'https://doevida.com.br/novo',
    siteName: 'Doe Vida',
    type: 'website',
  },
};

export default function NovoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
