import { useState } from 'react';

export const useTemplates = () => {
    const [templates, setTemplates] = useState<any[]>([]);

    // Agrega lógica adicional si es necesario

    return {
        templates,
        setTemplates,
    };
};
