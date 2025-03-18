# Documentación de la Carpeta Templates

La carpeta `templates` centraliza todo lo relacionado con la gestión y edición de plantillas en la aplicación, abarcando tanto la parte de edición visual como la de configuración y despliegue de plantillas en diferentes contextos (documentos y proyectos). A continuación se detalla la estructura y función de cada parte:

---

## Archivos de raíz

- **config.ts**  
  Define la configuración general para la ruta de templates. Por ejemplo, se deshabilita la generación estática en rutas dinámicas, se configura la caché y se establece el middleware de autenticación.

- **layout.tsx**  
  Componente de layout para la sección de templates. Gestiona la distribución general de la interfaz y puede incluir lógica de protección de rutas o autenticación.

- **page.tsx**  
  Punto de entrada para la ruta `/templates`. Generalmente se encarga de integrar el contenido principal y delegar en componentes específicos según la funcionalidad requerida.

- **TemplatesPageContent.tsx**  
  Componente principal que se encarga de mostrar y administrar las plantillas. En este archivo se gestionan las pestañas (por ejemplo, para documentos y proyectos), llamadas a Supabase para obtener datos y la navegación hacia editores o vistas de detalle.

- **templates_docs.md**  
  (Este documento) Resume la estructura y el propósito de la carpeta `templates`.

---

## Subcarpetas

### editor/

Esta carpeta agrupa todo lo relacionado con el editor de plantillas (especialmente para el modo visual o interactivo).

- **editor_docs.md**  
  Documenta la estructura y funcionalidad interna del editor. Resume la función de los componentes y las rutas específicas.

- **[id]/**  
  Carpeta dinámica para la edición de una plantilla en particular basándose en el ID.  
  - **layout.tsx**: Se encarga de la estructura y protección de la ruta de edición para una plantilla específica.  
  - **page.tsx**: Página principal para editar la plantilla correspondiente al ID indicado; integra el componente principal del editor en base a dicho ID.

- **components/**  
  Contiene los componentes específicos para el editor de plantillas.  
  - **BlockEditorPage.tsx**: Componente principal para el editor visual. Gestiona la carga de datos, edición de nodos, mapeo de campos y acciones para guardar la plantilla.  
  - **BlockEditorPage.css**: Hojas de estilo asociadas a BlockEditorPage, determinando la apariencia del editor, botones, contenedores y estados de interacción.

---

### visual-editor/

Esta carpeta se orienta hacia la experiencia visual de edición y migración de plantillas, y contiene elementos tanto para la vista interactiva como para la documentación de procesos de migración y eliminación de componentes legacy.

- **informederevisión_templates.md**  
  Documento que detalla el plan de migración y eliminación de componentes legacy. Incluye fases, comandos (pnpm, Docker, etc.) y pasos de validación para asegurar que la migración no afecte la funcionalidad del editor ni la integridad de las plantillas.

- **page.tsx**  
  Componente que implementa la interfaz del editor visual. Contiene lógica para cargar datos desde Supabase, gestionar nodos y edges propios de la representación visual, y establecer redirecciones o validaciones (como evitar navegar sin guardar cambios).

---

## Consideraciones adicionales

- **Integraciones y Variables de Entorno**:  
  Recuerda que las variables de entorno se encuentran en el archivo `.env.local` y son utilizadas para la conexión y configuración del backend montado mediante Supabase en un entorno Docker.

- **Gestión de Dependencias y Repositorios**:  
  Se prefiere el uso de `pnpm` para la instalación y manejo de dependencias en el proyecto.

- **Documentación Complementaria**:  
  La arquitectura general del proyecto se documenta en [Docs/arquitectura.md](../Docs/arquitectura.md). Mantén este archivo actualizado al realizar modificaciones en la estructura del proyecto. Además, si se implementan nuevas características o correcciones, consulta [Feature_solver.md](../Docs/feature_solver.md) y [bug_fixer.md](../Docs/bug_fixer.md) para asegurar el cumplimiento de los procesos establecidos.

---

Esta documentación proporciona una visión general de la estructura y coherencia dentro de la carpeta `templates`, facilitando tanto el desarrollo como el mantenimiento y futuras modificaciones de la funcionalidad de plantillas en la aplicación.