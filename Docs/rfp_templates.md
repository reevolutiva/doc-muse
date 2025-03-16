**Documento de Requerimientos de Funcionalidad (FRD)**

### Funcionalidad: Interfaz de creación de plantillas

**Versión:** 1.0  
**Fecha:** 15 de marzo de 2025  
**Autor:** Giorgio La Pietra

# Documento de Requerimiento: Creación Visual de Plantillas con React Flow (xyflow)

## Objetivo

Implementar una interfaz visual, interactiva e intuitiva para la creación y gestión de plantillas de proyectos y documentos, integrando React Flow (xyflow [https://github.com/xyflow/xyflow](https://github.com/xyflow/xyflow)) para mejorar sustancialmente la experiencia del usuario, claridad en la gestión de dependencias y edición dinámica.

## 1. Sección: Gestión Visual de Plantillas

### Interfaz General

- Integración de React Flow (xyflow) para visualización de flujos y dependencias.
- Vista tipo canvas que permite creación dinámica y visual de elementos.

### Tarjetas y Nodos

Cada plantilla (proyecto o documento) se representa como nodos que contienen:

- Nombre y tipo (Documento o Proyecto).
- Iconos representativos para visualización rápida.
- Opciones rápidas: Editar, duplicar, eliminar.

### Conexiones

- Líneas visuales claras indicando dependencias.
- Capacidad de conexión a nivel de:
  - Documento a Documento.
  - Secciones o bloques específicos entre documentos.

## 2. Creación y Edición Visual de Plantillas

### Área Canvas

- Interfaz React Flow para diseño visual.
- Paleta lateral con plantillas de documentos existentes arrastrables.
- Capacidad de añadir nuevos nodos directamente al canvas.

### Propiedades del Nodo

Al seleccionar un nodo:

- Mostrar propiedades editables:
  - Título.
  - Descripción breve.
  - Checkbox para obligatoriedad.
  - Gestión y creación directa de prompts para generación de contenido IA.

### Conexión Interactiva

- Al conectar nodos, opción para establecer claramente el tipo de dependencia (por ejemplo, "depende de", "se ejecuta después de", etc.).

## 3. Gestión avanzada de Bloques y Prompts

- Interfaz específica dentro de cada nodo para:
  - Editar bloques del documento.
  - Crear o modificar prompts IA.
  - Previsualizar inmediatamente contenido generado por IA desde el mismo nodo.

## 4. Requerimientos técnicos

- Almacenamiento robusto en Supabase:

  - JSONB para estructura interna del documento.
  - Campos adicionales:
    - `is_required`: boolean.
    - `sequence_order`: integer.
    - `dependencies`: JSONB detallando bloques específicos o documentos dependientes.

- Implementación de lazy-loading para eficiencia en rendimiento.

- Optimización API para reducir tiempos de generación IA.

## 5. Mejoras propuestas en la interfaz actual

### Claridad y Accesibilidad

- Dashboard visual con estado, dependencias y progreso.
- Buscador global integrado para documentos y plantillas.

### Interactividad Mejorada

- Drag & Drop dinámico con retroalimentación inmediata en el canvas.
- Sistema intuitivo de manejo visual de dependencias.

### Facilidad en la Edición

- Botón "Quick Add" en el canvas para plantillas existentes.
- Historial visual de versiones y cambios dentro de cada nodo o plantilla.

## 6. Métricas de éxito

- Reducción de al menos un 50% del tiempo requerido para crear y editar plantillas.
- Mejora en feedback de usuarios sobre facilidad y claridad del proceso.

---

# Mockup Interactivo: Creación Visual de Plantillas con React Flow (xyflow)

## Descripción del Mockup

Este mockup interactivo ilustra la interfaz visual para la gestión y creación dinámica de plantillas usando React Flow (xyflow). Los usuarios pueden visualizar claramente dependencias y conexiones entre documentos y proyectos mediante un canvas interactivo.

## Elementos Clave del Mockup

### Canvas Interactivo

- Área principal donde se crean, visualizan y organizan nodos (documentos o proyectos).
- Capacidad de mover, conectar, y reorganizar nodos mediante drag & drop.

### Nodos (Documentos/Proyectos)

- Representados visualmente con tarjetas diferenciadas por colores o íconos.
- Información básica visible directamente (nombre, estado).
- Opciones rápidas visibles al hacer clic en cada nodo (Editar, Duplicar, Eliminar).

### Panel de Propiedades

- Se muestra al seleccionar un nodo específico:
  - Nombre y descripción editable.
  - Opciones para marcar obligatoriedad.
  - Edición rápida de prompts para generación de contenido con IA.
  - Previsualización instantánea del contenido generado por IA.

### Conexiones

- Líneas claras mostrando dependencias o relaciones entre documentos y proyectos.
- Capacidad de definir explícitamente el tipo de dependencia mediante etiquetas interactivas.
- Visualización dinámica y clara con tooltip al pasar el cursor sobre la conexión.

### Menú lateral

- Incluye listado de plantillas existentes arrastrables hacia el canvas.
- Botón de acceso rápido para crear nuevos documentos o proyectos.

## Interactividad del Mockup

- Selección y movimiento de nodos en tiempo real.
- Creación dinámica de conexiones con líneas visuales claras.
- Edición de propiedades desde un panel lateral interactivo con feedback visual inmediato.
- Visualización en tiempo real de contenido generado mediante prompts de IA.

## Próximos Pasos

- Validar el mockup con usuarios reales.
- Recoger feedback y realizar mejoras de usabilidad antes de comenzar la implementación técnica completa.

---
