# **Proyecto de Inducción Corporativa: Documento General de Módulos y Características**

## 1. Resumen del Proyecto
Kimfe es una plataforma que integra la **creación y administración de proyectos educativos**, facilitando la construcción de documentación, recursos y experiencias de aprendizaje basadas en IA. En este caso, la plataforma busca atender las necesidades de *inducción corporativa*, permitiendo a las organizaciones estructurar planes de formación para sus colaboradores de manera ágil y escalable.

## 2. Objetivo Principal
Proveer una **solución centralizada** donde se pueda:
1. **Crear y gestionar proyectos** de formación (inducción, entrenamientos, capacitaciones).
2. **Subir y almacenar documentos base** para cada proyecto.
3. **Generar documentos educativos** (Plan de Formación, Guion Instruccional, etc.) con asistencia de IA.
4. **Establecer plantillas de proyectos** y secuencias de documentos, facilitando la estandarización de procesos formativos.
5. **Colaborar** y **versionar** la documentación a través de un editor integrado (Etherpad u otro).

---
## 3. Módulos y Características Principales

### 3.1 Módulo de Proyectos
- **Creación de Proyectos**: El usuario (Admin/Instructor) da de alta un proyecto, indicando título, tipo (ej. eLearning, Taller), descripción y objetivos.
- **Selección de Plantilla de Proyecto**: Cada proyecto puede asociarse a una plantilla predefinida (p. ej.: *E-Learning Course*, *Microlearning*, *Workshop*) para determinar qué documentos deben crearse.
- **Vista de Proyectos**: Una pantalla muestra todos los proyectos existentes con barras de progreso, estado (En progreso, Completado) y la fecha de última actualización.
- **Edición de Proyectos**: Posibilidad de cambiar información (nombre, tipo, plantilla) y ver la pestaña de "Document Knowledge Base".

### 3.2 Módulo de Document Knowledge Base (Recursos & Docs)
- **Subida de Documentos Base**: Permite cargar archivos (PDF, Word, etc.) que servirán como insumo o referencia para la IA.
- **Indexación / Embeddings (Opcional para IA)**: Los documentos base pueden procesarse (embeddings) para que la IA realice búsquedas contextuales.
- **Plantillas Disponibles**: Muestra en la pestaña `Templates` la lista de *document templates* que el proyecto requiere (basadas en la plantilla de proyecto).
- **Creación de Documento desde Plantilla**: Botón "Create Document" que genera un documento real a partir de la plantilla seleccionada.

### 3.3 Módulo de Creación de Documentos ("Create" / "Required Docs")
- **Interfaz de Creación**: Se listan distintos tipos de documentos (Blog, Investigación, Plan de Formación, etc.). Estos pueden estar filtrados o habilitados según la plantilla del proyecto.
- **Dependencias** (Opcional): Al definir secuencias de documentos (por ejemplo, un *Insumo Base* antes de un *Guion Instruccional*), se bloquea la creación de documentos que dependan de otros no completados.
- **Integración con IA**: Posibilidad de “Generar contenido” o “Reutilizar contenido” basándose en los documentos base o en versiones previas.

### 3.4 Módulo de Edición Colaborativa
- **Editor Etherpad**: Al crear un documento, se abre un editor colaborativo. Los usuarios con permiso pueden editar en tiempo real.
- **Versionado**: Cada actualización se registra en `document_versions`, permitiendo ver el historial y restaurar versiones.
- **Marcado de Estado** (Borrador, En curso, Completado): Opción para que un usuario con rol (Admin/Instructor) marque el documento como completado.

### 3.5 Roles y Permisos
- **Administrador**: Crea proyectos, asigna plantillas, configura permisos.
- **Instructor**: Responsable de editar documentos, subir materiales, marcar avances.
- **Usuario**: Acceso restringido a la lectura de documentos o edición limitada, según configuración.

---
## 4. Flujo General de Uso
1. **Creación de Proyecto**: Se llena un formulario con título, tipo, objetivos y se selecciona la plantilla de proyecto.
2. **Carga de Recursos**: En "Document Knowledge Base" → "Documents", se suben archivos base (PDF, Word). Opcionalmente, se indexan para la IA.
3. **Generación de Documentos**: En "Document Knowledge Base" → "Templates" o en la pestaña "Create", se listan los documentos requeridos según la plantilla. Al dar clic en "Create Document", se genera un documento real y se abre la vista de edición.
4. **Edición y Versionado**: El usuario utiliza Etherpad para construir el contenido formativo. Puede usar IA (futuro) para sugerir secciones.
5. **Completado**: Al finalizar, se marca como "Completado" y la barra de progreso del proyecto avanza.

---
## 5. Resumen de Tablas Principales (Nivel Alto)
1. **projects**: Guarda datos básicos de cada proyecto (título, tipo, estado, progreso, plantilla asociada).
2. **project_templates**: Define tipos de proyectos (E-Learning Course, Microlearning, etc.).
3. **document_templates**: Plantillas de documentos (Plan de Formación, Documento de Investigación...).
4. **project_template_doc_templates**: Relación que indica qué documentos van en cada plantilla de proyecto y en qué orden.
5. **document_versions**: Almacena el contenido de los documentos creados, con versionado.
6. **document_embeddings** (Opcional IA): Guarda representaciones vectoriales para búsqueda.

---
## 6. Características Clave para la Próxima Iteración
1. **Dependencias de Documentos**: Bloquear la creación de un documento si no se ha completado otro que lo precede.
2. **IA Integrada**: Botón para “Reutilizar” o “Generar contenido” desde los documentos base indexados.
3. **Notificaciones**: Mensajes de aviso al completar un documento o al desbloquear el siguiente.
4. **Gestión de Roles**: Asegurar que usuarios con distintos roles tengan accesos y permisos adecuados (creación, edición, completado).

---
## 7. Beneficios y Objetivos
- **Agilidad en la Creación de Contenidos**: Permite a equipos formativos generar rápidamente los documentos de inducción (o cualquier proyecto educativo).
- **Estandarización**: Uso de plantillas prediseñadas para asegurar la calidad y consistencia de la documentación.
- **Colaboración**: Edición colaborativa en tiempo real y versionado que reduce fricción y duplicación de esfuerzos.
- **Escalabilidad**: Cuando se integre la IA plenamente, la plataforma podrá reutilizar conocimiento corporativo para automatizar la construcción de nuevos cursos.


