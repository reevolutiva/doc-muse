# Documentación de la Carpeta Editor

La carpeta `editor` centraliza todo lo relacionado con el editor de plantillas en la aplicación. A continuación se detalla la estructura y función de cada subdirectorio y archivo:

- **editor_docs.md**  
  Este documento (el actual) resume la estructura y el propósito de la carpeta.

- **[id]/**
  - **layout.tsx**  
    Gestiona la distribución y las protecciones de rutas para las plantillas, verificando la sesión del usuario mediante Supabase.
  - **page.tsx**  
    Página principal para el editor de plantillas. Importa e integra el componente principal del editor (BlockEditorPage) según el ID de la plantilla.

- **components/**
  - **BlockEditorPage.tsx**  
    Componente principal del editor visual de plantillas. Este archivo gestiona la carga de datos, edición de nodos, mapeo de campos y acciones para guardar la plantilla.
  - **BlockEditorPage.css**  
    Estilos asociados al componente BlockEditorPage, definendo la apariencia del editor, botones de acción, contenedores, y estados de interacción.

Esta estructura permite una gestión clara y modular del editor de plantillas, facilitando la edición visual con funcionalidades dinámicas tales como selección y actualización de nodos, mapeo de campos y guardado de la plantilla.