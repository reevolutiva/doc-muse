# Instrucciones para Resolver el Problema Nº 3: Refactorización Arquitectónica y Sistema de Tipos

1. **Análisis Inicial**: "Analiza el repositorio Doc-Muse y genera un inventario completo de componentes, hooks y servicios relacionados con las plantillas. Identifica patrones, inconsistencias y posibles áreas problemáticas."

2. **Mapeo de Dependencias**: "Crea un mapa de dependencias entre los componentes frontend y los servicios backend, mostrando cómo fluyen los datos entre Supabase, las funciones edge y los componentes de React."

3. **Planificación de Estructura**: "Basándote en el plan acordado, detalla la nueva estructura de directorios para refactorizar templates, hooks y tipos. Define qué archivos se moverán a cada ubicación y qué nombres deberían tener."

4. **Sistema de Tipos**: "Define un conjunto centralizado de interfaces y tipos para el sistema de plantillas que resuelva los problemas de seguridad de tipos actuales. Elimina todos los usos de `any` y proporciona interfaces estrictas."

5. **Clarificación de Arquitectura Backend**: "Analiza las responsabilidades actuales del directorio `backend/` y su relación con Supabase. Propón una arquitectura clara que divida responsabilidades entre funciones edge de Supabase y servicios backend."

6. **Plan de Migración**: "Desarrolla un plan paso a paso para migrar componentes existentes a la nueva estructura sin romper la funcionalidad actual. Incluye un enfoque para actualizar todas las importaciones."

7. **Pruebas y Validación**: "Crea una estrategia de pruebas para verificar que la refactorización mantiene toda la funcionalidad existente. Incluye pruebas de typecheck y flujos de usuario clave."

8. **Documentación de Arquitectura**: "Genera documentación que explique claramente la nueva arquitectura, incluyendo diagramas de flujo de datos y directrices para futuras implementaciones."
