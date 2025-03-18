"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProjectTemplatesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/templates?tab=projects');
  }, [router]);
  
  return null;
}