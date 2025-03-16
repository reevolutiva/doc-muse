import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}