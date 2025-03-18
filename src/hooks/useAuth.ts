"use client"

import { useState, useEffect } from "react"
import { Session } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Flag para evitar actualizar estado en componentes desmontados
    let isMounted = true;

    const setupAuth = async () => {
      try {
        console.log("Setting up auth session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (isMounted) {
          console.log("Auth session state:", { hasSession: !!data.session });
          setSession(data.session);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error getting auth session:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        console.log("Auth state changed:", { event: _event, hasSession: !!session });
        setSession(session);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    error,
    isAuthenticated: !!session
  };
}
