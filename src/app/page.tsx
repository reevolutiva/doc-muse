import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir automáticamente a la página de proyectos
  redirect('/projects');
  
  // El código siguiente no se ejecutará debido a la redirección,
  // pero se mantiene como referencia o si se decide cambiar la estrategia
  /* 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a Doc-Muse</h1>
        <p className="text-xl mb-8">Tu plataforma para gestión inteligente de documentos</p>
        
        <div className="mt-8 flex gap-4">
          <Link 
            href="/projects" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Proyectos
          </Link>
          
          <Link 
            href="/documents" 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Ver documentos
          </Link>
        </div>
      </div>
    </main>
  );
  */
}
