# Hoja de Ruta de Implementación: Nueva Interfaz Visual con React Flow e Integración IA

Este documento describe los pasos detallados para implementar los cambios significativos en la creación y gestión visual de plantillas, basados en las mejoras descritas en [rfp_templates.md](src/app/project-templates/rfp_templates.md).

---

## 1. Revisión y Análisis de Requisitos

- **Objetivos Principales:**
  - Eliminar el campo “Tipo” en las plantillas de documentos, simplificando la lógica de identificación.
  - Integrar React Flow (xyflow) para la gestión interactiva de nodos y conexiones.
  - Implementar nodos visuales con propiedades editables (nombre, descripción, obligatoriedad y prompts IA).
  - Habilitar la creación y visualización de dependencias entre documentos y bloques con tooltips informativos.
  - Actualizar el esquema de datos en Supabase para almacenar dependencias visuales en formato JSONB.

- **Documentos de Referencia:**
  - [Documento de Requerimientos (FRD)](src/app/project-templates/rfp_templates.md)
  - [README.md](README.md) y demás documentación del proyecto.

---

## 2. Configuración del Entorno

- **Instalación de Dependencias:**
  - Añadir la librería React Flow (`xyflow`) al proyecto.
  - Verificar que el entorno de React esté adecuadamente configurado para la integración con nuevas dependencias.

- **Acciones:**
  - Actualizar `package.json` para incluir React Flow.
  - Ejecutar la instalación y validar la compatibilidad.

---

## 3. Creación del Canvas y Layout Visual

- **Diseño del Canvas:**
  - Definir un área principal tipo canvas que permita la visualización interactiva de plantillas (documentos y proyectos).
  - Diseñar una paleta lateral que contenga elementos arrastrables para crear nuevos nodos en el canvas.

- **Acciones:**
  - Crear/actualizar el componente de Canvas, integrando React Flow.
  - Definir estilos y layouts coherentes con la interfaz actual.

---

## 4. Implementación de Nodos y Conexiones

- **Nodos Visuales:**
  - Cada nodo representará un documento o proyecto, mostrando:
    - Nombre, descripción y estado visual.
    - Opciones para editar, duplicar y eliminar.
  - Incorporar componentes para edición de prompts IA de manera directa.
  
- **Conexiones e Interacciones:**
  - Establecer líneas que indiquen dependencias entre nodos.
  - Añadir tooltips o ventanas emergentes para visualizar detalles rápidos de la conexión cuando el usuario pase el cursor.

- **Acciones:**
  - Desarrollar y personalizar componentes de nodo y conexión en React Flow.
  - Garantizar la experiencia de arrastrar y soltar (Drag & Drop) y la edición en tiempo real.

---

## 5. Panel de Propiedades y Edición Dinámica

- **Panel Lateral:**
  - Desplegar un panel de propiedades cuando se seleccione un nodo.
  - Permitir la edición de:
    - Nombre
    - Descripción corta
    - Checkbox para obligatoriedad
    - Prompts para generación automática de contenido IA (con previsualización en el mismo nodo).

- **Acciones:**
  - Implementar el componente de panel lateral y conectar su estado con los nodos.
  - Asegurar retroalimentación visual inmediata y validación de datos.

---

## 6. Integración de la Lógica de IA

- **Generación de Contenido:**
  - Permitir generación inmediata de contenido mediante prompts definidos en cada nodo.
  - Previsualizar el contenido generado de forma directa.

- **Acciones:**
  - Integrar los controles visuales y APIs necesarias para la generación de contenido IA.
  - Realizar pruebas iniciales de generación y previsualización de contenido.

---

## 7. Actualización del Esquema de Datos en Supabase

- **Modificaciones de Backend:**
  - Eliminar el campo “Tipo” de las plantillas de documento.
  - Ajustar la estructura JSONB para soportar almacenamiento de nodos y conexiones visuales.
  - Garantizar que la relación entre proyectos y documentos sea clara y consistente.

- **Acciones:**
  - Actualizar scripts y migraciones en el backend (verificar [deploy.py](backend/deploy.py) y otros archivos en el directorio `backend/`).
  - Probar la persistencia de datos mediante pruebas de integración.

---

## 8. Validación, Pruebas y Optimización

- **Pruebas Unitarias e Integración:**
  - Crear tests para validar la integridad de la nueva interfaz.
  - Realizar pruebas de usabilidad con usuarios reales.
  - Verificar exhaustivamente las conexiones y dependencias visuales para asegurar integridad.

- **Acciones:**
  - Configurar y ejecutar pruebas unitarias e integración en el entorno de desarrollo.
  - Documentar y corregir errores detectados durante la fase de pruebas.

---

## 9. Despliegue y Retroalimentación

- **Beta y Feedback:**
  - Lanzar una versión beta a un grupo reducido de usuarios.
  - Recoger feedback y realizar ajustes iterativos en la interfaz y experiencia de usuario.

- **Acciones:**
  - Desplegar la versión inicial y habilitar mecanismos de feedback.
  - Planificar iteraciones de mejoras basadas en el feedback recibido.

---

## 10. Seguimiento y Documentación Continua

- **Documentar Cambios:**
  - Mantener actualizada la documentación del proyecto con los nuevos cambios (actualizar el [README.md](README.md) y otros documentos relevantes).
  - Establecer reuniones semanales de seguimiento para evaluar el progreso y asignar tareas.

- **Acciones:**
  - Documentar cada fase y actualización en repositorio.
  - Actualizar la hoja de ruta periódicamente y comunicar los avances al equipo.

---

## ✅ Checklist de Implementación

- [ ] Revisión de requisitos y actualización de documentos de especificación.
- [ ] Instalación y configuración de React Flow.
- [ ] Creación del canvas y paleta lateral en la interfaz.
- [ ] Implementación de nodos interactivos y conexiones con tooltips.
- [ ] Desarrollo del panel de propiedades para edición en tiempo real.
- [ ] Integración de generación inmediata de contenido mediante IA.
- [ ] Actualización del esquema en Supabase y migraciones necesarias.
- [ ] Desarrollo y ejecución de pruebas unitarias e integración.
- [ ] Despliegue de versión beta y recolección de feedback.
- [ ] Iteración y documentación continua del proceso de implementación.

---

Esta hoja de ruta servirá como guía para el desarrollo paso a paso de la nueva funcionalidad en la plataforma. Se recomienda revisar y ajustar los pasos a medida que se avance en el desarrollo basado en el feedback y los desafíos encontrados.
