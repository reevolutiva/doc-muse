import { useState, useEffect } from 'react';

export const useTemplateLoader = () => {
    const [templates, setTemplates] = useState<any[]>([]);

    useEffect(() => {
        // Implementa la lógica para cargar plantillas.
        // Por ejemplo, llamar a un endpoint de Supabase para obtener la data.
        setTemplates([]);
    }, []);

    return templates;
};
