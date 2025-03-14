**Feature Requirement Document (FRD)**

### Funcionalidad: Plantillas de Documentos

**Versión:** 1.1\
**Fecha:** 13 de marzo de 2025\
**Autor:** Giorgio La Pietra

## 1. Objetivo General

Crear una funcionalidad para gestionar plantillas reutilizables para documentos dentro de la plataforma Kimfe, facilitando la estandarización, automatización y agilización del proceso formativo mediante agentes de inteligencia artificial (IA).

## 2. Alcance

**Incluido:**

- Creación, edición y gestión de plantillas para documentos.
- Definición de estructuras en formato JSONL para documentos, que incluyen prompts personalizados para agentes IA.
- Administración centralizada de plantillas accesibles según roles y permisos.

**Excluido:**

- Gestión avanzada de contenido multimedia directamente desde las plantillas.
- Funcionalidades de versionado avanzado o control de cambios detallado.
- Gestión de dependencias y referencias cruzadas entre documentos.

## 3. Descripción de la Funcionalidad

La funcionalidad permitirá:

1. **Plantillas de Documentos:**
   - Crear plantillas mediante estructuras JSONL que contienen bloques definidos (encabezados, párrafos, listas, etc.).
   - Cada bloque posee campos como:
     - `blockId`: Identificador único del bloque.
     - `type`: Tipo de contenido (todos los formatos estáticos o dinámicos html5).
     - `data`: Contenido inicial del bloque.
     - `description`: Descripción breve del propósito del bloque.
     - `system`: Prompt IA asociado para generar automáticamente el contenido.

## 4. Requisitos Funcionales

- **RF1:** Creación de Plantillas JSONL para documentos, con soporte para múltiples tipos de bloques.
- **RF2:** Editor visual e interactivo para modificar fácilmente el contenido y los prompts de cada bloque.
- **RF3:** Administración de plantillas por roles, restringiendo creación, edición y aplicación según privilegios (Superuser, Admin Corporativo).

## 5. Requisitos No Funcionales

- **RNF1:** Usabilidad – Interfaz intuitiva y accesible desde escritorio y tablets.
- **RNF2:** Rendimiento – Respuestas rápidas, con generación de contenido IA en menos de 3 segundos.
- **RNF3:** Seguridad – Datos cifrados en tránsito y reposo; control de acceso robusto basado en roles.
- **RNF4:** Escalabilidad – Arquitectura modular para integrar futuras funcionalidades o tipos de bloque.

## 6. Casos de Uso

### Caso de Uso 1: Creación y Edición de Plantilla de Documento

- **Actor:** Admin Corporativo
- **Flujo:**
  1. Accede a la sección de plantillas.
  2. Selecciona “Crear nueva plantilla” o edita una existente.
  3. Define estructura JSONL, edita prompts.
  4. Guarda y publica la plantilla para uso interno.

## 7. Dependencias y Consideraciones Técnicas

- **Integración Backend:** Conexión con Supabase para gestión de plantillas.
- **Integración Motor IA:** Generación automática de contenidos mediante LLM.

## 8. Métricas de Éxito

- Número de plantillas creadas y utilizadas en primeros tres meses.
- Evaluación positiva de usuarios en encuestas sobre usabilidad y utilidad.

## 9. Plan de Pruebas

- **Pruebas Unitarias:** Validación de creación y edición de plantillas.
- **Pruebas de Integración:** Verificación integración con backend e IA.
- **Pruebas de Usabilidad:** Testing con usuarios reales sobre facilidad y eficacia del proceso.

---

**Prompts IA Estándar (Ejemplos):**

- **Encabezado:** "Genera una introducción clara y concisa sobre [tema específico]"
- **Párrafo:** "Explica en detalle el concepto [específico], aplicando un estilo formal y profesional."
- **Lista:** "Genera una lista de puntos clave sobre [tema]. Cada punto debe ser breve y enfocado en resultados."

---

**¿Deseas ajustar o profundizar algún aspecto adicional?**

