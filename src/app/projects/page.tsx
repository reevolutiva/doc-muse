"use client"


import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProjectsClient from './ProjectsClient';

export default function ProjectsPage() {  

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

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
      <div className="container mx-auto py-8 max-w-7xl mt-[100px]">
        <ProjectsClient />
      </div>
    )
}
