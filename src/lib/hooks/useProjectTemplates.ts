"use client"

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ProjectTemplateService } from '@/lib/services/project-template-service';
import { 
  ProjectTemplate, 
  ProjectTemplateCreateOptions, 
  UseProjectTemplatesResult 
} from '@/lib/types/project-template';
import { useAuth } from "@/hooks/useAuth";

export function useProjectTemplates(): UseProjectTemplatesResult {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);
  
  const { session } = useAuth();

  const fetchTemplates = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await ProjectTemplateService.getProjectTemplates();
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      setError(error);
      console.error('Error fetching project templates:', error);
      toast.error('Error al cargar las plantillas de proyecto');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar plantillas al inicializar
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSaveTemplate = useCallback(async (formData: Partial<ProjectTemplate>): Promise<void> => {
    try {
      setLoading(true);
      let result;
      
      if (editingTemplate) {
        // Actualizar plantilla existente
        result = await ProjectTemplateService.updateProjectTemplate(
          editingTemplate.id,
          {
            name: formData.name,
            description: formData.description
          }
        );
      } else {
        // Crear nueva plantilla
        result = await ProjectTemplateService.createProjectTemplate({
          name: formData.name || '',
          description: formData.description
        });
      }

      const { data, error } = result;
      if (error) throw error;
      
      // Actualizar la lista de plantillas
      await fetchTemplates();
      
      // Cerrar el diálogo y limpiar el template en edición
      setShowDialog(false);
      setEditingTemplate(null);
      
      // Notificar éxito
      toast.success(
        editingTemplate
          ? 'Plantilla actualizada correctamente'
          : 'Plantilla creada correctamente'
      );
    } catch (error) {
      console.error('Error saving project template:', error);
      toast.error(
        editingTemplate
          ? 'Error al actualizar la plantilla'
          : 'Error al crear la plantilla'
      );
    } finally {
      setLoading(false);
    }
  }, [editingTemplate, fetchTemplates]);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const { success, error } = await ProjectTemplateService.deleteProjectTemplate(id);
      
      if (error) throw error;
      if (success) {
        // Actualizar la lista de plantillas
        await fetchTemplates();
        toast.success('Plantilla eliminada correctamente');
      }
    } catch (error) {
      console.error('Error deleting project template:', error);
      toast.error('Error al eliminar la plantilla');
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    showDialog,
    editingTemplate,
    setShowDialog,
    setEditingTemplate,
    handleSaveTemplate,
    handleDelete,
    fetchTemplates
  };
}