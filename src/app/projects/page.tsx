"use client"


import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProjectsClient from './ProjectsClient';

export default function ProjectsPage() {  

   return (
      <div className="container mx-auto py-8 max-w-7xl mt-[80px]">
        <ProjectsClient />
      </div>
    )
}
