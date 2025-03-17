import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthForm } from "@/components/auth/auth-form";
import { supabase } from "@/lib/supabase";
import { Toaster } from "sonner";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Solo redirigir a proyectos si hay una sesión activa
          router.push('/projects');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/projects');
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Cargando...</p>
      </div>
    );
  }
  
  // Si no hay sesión autenticada, mostrar el formulario de autenticación
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Doc-Muse</h1>
        <AuthForm />
      </div>
    </div>
  );
}
