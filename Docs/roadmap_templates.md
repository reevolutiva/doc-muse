# Hoja de Ruta de Implementación: Nueva Interfaz Visual con React Flow e Integración IA

Este documento describe los pasos detallados para implementar los cambios significativos en la creación y gestión visual de plantillas, basados en las mejoras descritas en [rfp_templates.md](src/app/project-templates/rfp_templates.md).

---

## 1. Revisión y Análisis de Requisitos ✅

- **Objetivos Principales:**
  - ✅ Eliminar el campo "Tipo" en las plantillas de documentos, simplificando la lógica de identificación.
  - ✅ Integrar React Flow (xyflow) al proyecto y sus dependencias.
  - ✅ Definir estructura de nodos visuales con propiedades editables.
  - ✅ Planificar sistema de dependencias entre documentos y bloques.
  - ✅ Diseñar esquema de datos en Supabase para el nuevo formato visual.

- **Documentos de Referencia:**
  - ✅ Documento de Requerimientos (FRD) actualizado
  - ✅ Documentación técnica y de proyecto revisada

---

## 2. Configuración del Entorno ✅

- **Instalación de Dependencias:**
  - ✅ Librería React Flow (@xyflow/react) instalada
  - ✅ Dependencias de UI (shadcn/ui) configuradas
  - ✅ Entorno de desarrollo Docker configurado

- **Acciones Completadas:**
  - ✅ package.json actualizado con nuevas dependencias
  - ✅ Configuración de Docker optimizada para desarrollo
  - ✅ next.config.js actualizado para ESM y configuraciones necesarias

---

## 3. Creación del Canvas y Layout Visual 🔄

- **Diseño del Canvas:**
  - ✅ Componente base TemplateCanvas implementado
  - ✅ Integración básica de React Flow realizada
  - 🔄 Paleta lateral en desarrollo

- **Acciones en Progreso:**
  - Refinamiento de estilos y layouts
  - Implementación de interacciones básicas
  - Optimización de rendimiento en el canvas
  - **Progreso:** Se han agregado componentes para arrastrar elementos y soltar en el canvas. Próximo paso: refinar validaciones durante el drag & drop.

## 3.1 Paleta Lateral 🔄
- Finalizar la paleta con elementos arrastrables.
- Permitir drag & drop en el canvas.
- Agregar validaciones y retroalimentación visual.

---

## 4. Implementación de Nodos y Conexiones 🔄

- **Nodos Visuales:**
  - ✅ Componente TemplateNode base creado
  - 🔄 Sistema de edición y propiedades en desarrollo
  - ⏳ Pendiente integración de prompts IA

- **Conexiones e Interacciones:**
  - 🔄 Sistema básico de conexiones implementado
  - ⏳ Pendiente implementación de tooltips
  - ⏳ Pendiente sistema de validación de conexiones

## 4. Implementación de Tooltips y Validaciones 🔄
- Añadir tooltips en conexiones para mostrar detalles.
- Implementar validaciones de conexiones (compatibilidad y reglas de dependencia).
- **Progreso:** Se definió la estructura básica de tooltips; se están añadiendo validaciones condicionales para conexiones dependientes.

---

## 5. Panel de Propiedades y Edición Dinámica 🔄

- **Panel Lateral:**
  - ✅ Componente PropertiesPanel base creado
  - 🔄 Sistema de edición en desarrollo
  - ⏳ Pendiente integración con el estado global

- **Próximas Acciones:**
  - Implementar validación de datos
  - Integrar sistema de feedback visual
  - Optimizar rendimiento de actualizaciones

---

## 6. Integración de la Lógica de IA ⏳

- **Estado:** Pendiente de iniciar
- **Próximos Pasos:**
  - Diseñar interfaz de prompts
  - Implementar sistema de previsualización
  - Integrar con API de generación

- Diseñar interfaz de prompts para generación de contenido.
- Implementar previsualización inmediata en el panel de propiedades.

---

## 7. Actualización del Esquema de Datos en Supabase 🔄

- **Modificaciones Realizadas:**
  - ✅ Migración para eliminar campo "Tipo" creada
  - ✅ Estructura JSONB para datos visuales definida
  - 🔄 Sistema de dependencias en implementación

- **Pendiente:**
  - Pruebas de integridad de datos
  - Optimización de consultas
  - Implementación de caché

---

## 8. Validación, Pruebas y Optimización ⏳

- **Estado:** Pendiente
- **Próximos Pasos:**
  - Crear suite de pruebas
  - Implementar pruebas de integración
  - Realizar pruebas de rendimiento

- Crear suite de pruebas unitarias y de integración.
- Incluir pruebas de usabilidad y optimizar rendimiento.

---

## 9. Despliegue y Retroalimentación ⏳

- **Estado:** Pendiente
- **Preparación:**
  - Definir grupo de beta testers
  - Preparar ambiente de staging
  - Diseñar sistema de recolección de feedback

- Preparar ambiente de staging y lanzar versión beta.
- Recoger feedback de usuarios y hacer iteraciones rápidas.

---

## 10. Seguimiento y Documentación Continua 🔄

- **En Progreso:**
  - 🔄 Actualización continua de documentación
  - 🔄 Seguimiento de problemas y soluciones
  - 🔄 Documentación de decisiones técnicas

---

## ✅ Checklist de Implementación Actualizado

- [x] Revisión de requisitos y actualización de documentos de especificación
- [x] Instalación y configuración de React Flow
- [x] Configuración inicial del entorno Docker
- [x] Creación de componentes base (Canvas, Node, Panel)
- [🔄] Implementación de sistema de nodos y conexiones
- [🔄] Desarrollo del panel de propiedades
- [⏳] Integración de generación IA
- [🔄] Actualización del esquema en Supabase
- [⏳] Desarrollo de pruebas
- [⏳] Despliegue beta

### Leyenda
✅ Completado
🔄 En Progreso
⏳ Pendiente

---

## Próximos Pasos Inmediatos

1. Resolver problemas de configuración en Docker para desarrollo
2. Completar implementación del sistema de nodos y conexiones
3. Finalizar panel de propiedades con todas las funcionalidades
4. Iniciar integración de lógica IA
5. Comenzar implementación de pruebas unitarias

---

Esta hoja de ruta se mantiene en actualización continua conforme avanza el desarrollo y se encuentran nuevos desafíos o requerimientos.
