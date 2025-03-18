"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Evitar múltiples redirecciones
    if (!loading && !hasRedirected.current) {
      setIsRedirecting(true);
      hasRedirected.current = true;
      
      console.log("Navigation state:", { hasSession: !!session, loading });
      
      // Pequeña pausa para evitar redirecciones demasiado rápidas
      setTimeout(() => {
        if (session) {
          router.push('/projects');
        } else {
          router.push('/templates');
        }
      }, 100);
    }
  }, [session, loading, router]);

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Esto no debería mostrarse normalmente debido a las redirecciones
  return null;
}
>>>>>>> ghcw-session-e95d
