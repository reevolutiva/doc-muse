"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProjectsClient from './ProjectsClient';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace('/');
    }
  }, [session, router]);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      const { data, error } = await supabase.from('projects').select('*')
      if (!error) setProjects(data || [])
      setLoading(false)
    }
    
    fetchProjects()
  }, [])
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </Link>
      </div>
      
      {/* Render projects list */}
      {/* ... */}
    </div>
  )
}
