"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export function AuthForm() {
  return (
    <div className="w-full max-w-[400px] mx-auto p-6 bg-white rounded-lg shadow-md">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#3B82F6',
                brandAccent: '#2563EB',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
      />
    </div>
  )
}
