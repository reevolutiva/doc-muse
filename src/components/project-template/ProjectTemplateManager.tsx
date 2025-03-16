import { useState, useEffect } from 'react';
import { TemplateCanvas } from '@/app/project-templates/components/TemplateCanvas';
import { toast } from 'react-hot-toast';

// Define the type for the template
interface Template {
  id: string;
  name: string;
  // Add other properties as needed
}

export const ProjectTemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch templates from API or database
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error: any) {
        toast.error(`Error fetching templates: ${error.message}`);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div>
      <h1>Project Template Manager</h1>
      <TemplateCanvas />
    </div>
  );
};
