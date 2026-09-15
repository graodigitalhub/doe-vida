import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6 animate-bounce">🩸</div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-300 mb-3">Campanha não encontrada</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Esta campanha pode ter sido encerrada ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-red-900 hover:-translate-y-1"
        >
          🏠 Ver Campanhas Ativas
        </Link>
      </div>
    </div>
  );
}
