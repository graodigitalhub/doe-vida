import type { Metadata } from 'next';
import './globals.css';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doevida.com.br';
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-9ZVQZS2GM0';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Doe Vida — Conectando corações para salvar vidas',
  description: 'Plataforma de campanhas de doação de sangue. Cadastre pedidos urgentes, gere cards profissionais para Instagram e WhatsApp e ajude a salvar vidas.',
  keywords: ['doação de sangue', 'hemocentro', 'tipo sanguíneo', 'campanha', 'doe vida', 'salvar vidas', 'banco de sangue'],
  authors: [{ name: 'Doe Vida' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Doe Vida — Conectando corações para salvar vidas',
    description: 'Cadastre pedidos de doação de sangue e gere cards virais para Instagram e WhatsApp.',
    url: siteUrl,
    siteName: 'Doe Vida',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doe Vida — Conectando corações para salvar vidas',
    description: 'Cadastre pedidos de doação de sangue e gere cards virais para Instagram e WhatsApp.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Doe Vida',
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description: 'Plataforma humanitária de campanhas de doação de sangue no Brasil.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Doe Vida',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'pt-BR',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
            <Link href="/" className="hover:opacity-90 transition-opacity shrink-0">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/#campanhas"
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors hidden sm:block"
              >
                Campanhas
              </Link>
              <Link
                href="/novo"
                id="cta-header"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-red-100 hover:shadow-red-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                <span>🩸</span>
                <span>Criar Pedido</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-400 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Logo size="sm" variant="full" className="[&_span]:text-white [&_.text-slate-500]:text-slate-400" />
              <div className="text-center md:text-right">
                <p className="text-sm">Feito com ❤️ para salvar vidas</p>
                <p className="text-xs mt-1 text-slate-600">© {new Date().getFullYear()} Doe Vida. Todos os direitos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
