**Documento de Requerimientos de Funcionalidad (FRD)**

### Funcionalidad: Plantillas de Proyecto

**Versión:** 1.0  
**Fecha:** 15 de marzo de 2025  
**Autor:** Giorgio La Pietra

## 1. Objetivo General
Implementar un sistema de plantillas para proyectos educativos en Kimfe, que permita encadenar secuencialmente documentos definidos en plantillas, gestionando dependencias entre estos documentos y sus bloques, automatizando así el flujo del proceso educativo.

## 2. Alcance

**Incluido:**
- Creación y gestión de plantillas de proyectos.
- Definición de secuencias de documentos dentro de un proyecto.
- Gestión de dependencias entre documentos y secciones.
- Vinculación entre plantillas de proyecto y plantillas de documentos.

**Excluido:**
- Control de versiones avanzado de proyectos.
- Gestión de contenido multimedia específico para proyectos.

## 3. Descripción de la Funcionalidad
La funcionalidad permitirá:

- Crear plantillas de proyectos que representan flujos educativos típicos.
- Establecer secuencias ordenadas de documentos que deberán completarse.
- Definir claramente dependencias entre documentos y, opcionalmente, entre secciones de documentos.
- Asignar automáticamente plantillas de documentos específicas según el tipo de proyecto seleccionado.
- Generar documentos automáticamente con prompts asociados para facilitar la generación de contenido por IA.

## 4. Requisitos Funcionales

- **RF1:** Creación de plantillas de proyectos.
- **RF2:** Vinculación de plantillas de documentos a tipos específicos de proyectos.
- **RF3:** Definición y gestión visual e interactiva de secuencias y dependencias entre documentos.
- **RF4:** Asociación directa de prompts personalizados desde la plantilla de documentos a documentos generados dentro del proyecto.
- **RF5:** Validación automática para evitar ciclos o dependencias incorrectas.

## 5. Requisitos No Funcionales

- **RNF1:** Interfaz visual clara e intuitiva.
- **RNF2:** Rendimiento óptimo en la generación y gestión de secuencias de documentos.
- **RNF3:** Seguridad y control basado en roles.
- **RNF4:** Escalabilidad para añadir futuros tipos de proyectos.

## 6. Casos de Uso

### Caso de Uso 1: Crear Plantilla de Proyecto
- **Actor:** Admin Corporativo
- **Flujo:**
  1. Accede a "Templates" y selecciona "Project Templates".
  2. Define la estructura del proyecto indicando secuencia y dependencias entre documentos.
  3. Vincula cada paso a una plantilla de documento previamente creada.
  4. Guarda y publica la plantilla para uso interno.

### Caso de Uso 2: Crear Proyecto desde Plantilla
- **Actor:** Usuario Corporativo
- **Flujo:**
  1. Selecciona "Nuevo Proyecto".
  2. Escoge tipo de proyecto y plantilla asociada.
  3. El sistema genera automáticamente la estructura del proyecto con documentos dependientes y prompts asignados.
  4. Completa documentos en el orden indicado por dependencias.

## 7. Consideraciones Técnicas

- Integración con Supabase para almacenamiento y recuperación.
- Automatización de prompts mediante integración con LLM.
- Sistema robusto para la validación y visualización gráfica de dependencias.

## 8. Métricas de Éxito

- Tiempo promedio reducido en creación y gestión de proyectos educativos.
- Incremento en la tasa de uso de plantillas.
- Retroalimentación positiva en usabilidad y efectividad del flujo de trabajo.

## 9. Plan de Pruebas

- Pruebas unitarias para creación y edición de plantillas.
- Pruebas de integración entre plantillas de proyecto y documentos.
- Pruebas de usabilidad con usuarios reales.

---

**Ejemplos de Prompts:**

- **Secuencia introductoria:** "Crea una introducción a partir del resultado del documento [nombre_doc_anterior]".
- **Dependencia entre bloques:** "Desarrolla la sección basada en la información proporcionada en la sección [sección_nombre] del documento anterior [documento_nombre]".
