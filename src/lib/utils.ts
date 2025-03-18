import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Database } from "./supabase.types"
import { supabase } from "@/lib/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DatabaseProject = Database['public']['Tables']['projects']['Row']

export interface Project {
  id: string
  title: string
  type: string
  status: "en-progreso" | "completado"
  progress: number
  documentsCount: number
  lastUpdate: string
}

export function mapDatabaseProjectToProject(dbProject: DatabaseProject): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    type: dbProject.type,
    status: dbProject.status as "en-progreso" | "completado",
    progress: dbProject.progress,
    documentsCount: dbProject.documents_count,
    lastUpdate: dbProject.updated_at ?? new Date().toISOString()
  }
}

export function mapDatabaseProjectsToProjects(dbProjects: DatabaseProject[]): Project[] {
  return dbProjects.map(mapDatabaseProjectToProject)
}


export const generarDocRaw = async ( id, nodes, edges ) => {

  console.log("Generando documento con template:", id);

  const kimfe_templateId = sessionStorage.getItem('kimfe-templateId');
  
  try {
    // Recopilar los datos de los nodos en un formato adecuado para Supabase
    const blocksData = nodes.map(node => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
    }));

    const content = { blocks: blocksData, edges: edges };

    console.log("Nodos:", content);

    // Actualizar la tabla 'projects.blocks' en Supabase
    const { data, error } = await supabase
    .from('document_templates')
    .update({ content : content })
    .eq('id', kimfe_templateId )
    .select()

    if (error) {
      console.error("Error al actualizar Supabase:", error);
      alert("Error al guardar los cambios en Supabase.");
      return;
    }

    console.log("Datos guardados en Supabase:", data);
    alert("Cambios guardados exitosamente en Supabase!");

  } catch (error) {
    console.error("Error inesperado:", error);
    alert("Ocurrió un error inesperado al guardar.");
  }
}