# Prompts para Agente IA: Implementación del Sistema de Testing

Este documento contiene una serie de prompts diseñados para ser ejecutados secuencialmente por un agente de IA, con el objetivo de implementar y mejorar el sistema de testing para Doc-Muse.

## Prompt 1: Análisis del Sistema Actual

```
Analiza la estructura actual del proyecto Doc-Muse. Identifica los componentes principales, hooks personalizados y páginas que necesitan pruebas. Genera un informe detallado con:
1. Lista de componentes críticos que deben tener pruebas
2. Hooks personalizados que requieren tests
3. Flujos de usuario principales que necesitan pruebas end-to-end
4. Estado actual de configuración de Jest y React Testing Library
```

## Prompt 2: Configuración del Entorno Base

```
Configura el entorno básico de testing para Doc-Muse:
1. Verifica las dependencias necesarias para Jest y React Testing Library
2. Actualiza o crea los archivos de configuración jest.config.js y jest.setup.js
3. Configura los mocks para next/router y para Supabase
4. Actualiza package.json con los scripts de testing necesarios
```

## Prompt 3: Implementación de Tests para Componentes UI Básicos

```
Implementa tests para los componentes UI básicos de Doc-Muse:
1. Crear tests para los componentes en src/components/ui/
2. Enfocarse en probar la renderización y las interacciones básicas
3. Usar patrones de testing que verifiquen el comportamiento desde la perspectiva del usuario
4. Implementar al menos un test de snapshot para cada componente
```

## Prompt 4: Implementación de Tests para Hooks Personalizados

```
Implementa tests para los hooks personalizados de Doc-Muse:
1. Crear tests para los hooks de autenticación
2. Implementar tests para hooks relacionados con Supabase
3. Probar hooks de gestión de estado
4. Verificar comportamiento con diferentes entradas y casos de uso
```

## Prompt 5: Tests para Componentes de Plantillas

```
Implementa tests para los componentes relacionados con plantillas:
1. Crear tests para TemplateNode
2. Implementar tests para FlowCanvas
3. Verificar la interacción con ReactFlow/XYFlow
4. Comprobar el comportamiento de edición de plantillas
```

## Prompt 6: Tests para APIs y Servicios

```
Implementa tests para las APIs y servicios:
1. Crear mocks para Supabase
2. Implementar tests para templateApi.ts
3. Verificar manejo de errores y casos límite
4. Comprobar transformaciones de datos
```

## Prompt 7: Configuración de GitHub Actions para CI/CD

```
Configura GitHub Actions para CI/CD:
1. Crear archivo .github/workflows/test.yml
2. Configurar jobs para ejecutar tests en cada push y pull request
3. Añadir pasos para verificar tipos con TypeScript
4. Configurar reporte de cobertura
```

## Prompt 8: Implementación de Husky para Pre-commit Hooks

```
Configura Husky para ejecutar tests antes de cada commit:
1. Instalar y configurar Husky
2. Configurar pre-commit hooks para ejecutar tests
3. Añadir script para verificar que no se rompa el build
4. Configurar lint-staged para verificar solo los archivos modificados
```

## Prompt 9: Configuración de Tests de Integración con Supabase Local

```
Configura tests de integración con Supabase local:
1. Crear scripts para iniciar/detener Supabase local
2. Configurar tests que interactúen con la base de datos local
3. Implementar fixtures para datos de prueba
4. Crear scripts de limpieza de datos después de los tests
```

## Prompt 10: Configuración de Tests End-to-End con Cypress

```
Configura Cypress para tests end-to-end:
1. Instalar y configurar Cypress
2. Crear tests para flujos de usuario principales:
   - Autenticación
   - Creación de documentos
   - Gestión de plantillas
   - Proyectos
3. Configurar GitHub Actions para ejecutar tests E2E
```

## Prompt 11: Optimización de Cobertura de Tests

```
Optimiza la cobertura de tests:
1. Ejecutar análisis de cobertura actual
2. Identificar áreas con baja cobertura
3. Implementar tests adicionales para aumentar cobertura
4. Configurar umbrales mínimos en jest.config.js
```

## Prompt 12: Documentación de Patrones de Testing

```
Documenta los patrones de testing específicos para Doc-Muse:
1. Actualizar test.md con ejemplos específicos del proyecto
2. Crear guía para testear componentes con React Flow
3. Documentar patrones para mocks de Supabase
4. Crear guía para nuevos desarrolladores sobre cómo escribir tests
```

## Prompt 13: Creación de Tests para Componentes de Navegación y Layout

```
Implementa tests para componentes de navegación y layout:
1. Crear tests para componentes de navegación
2. Implementar tests para layouts de páginas
3. Verificar comportamiento responsive
4. Comprobar integración con next/router
```

## Prompt 14: Tests para Manejo de Estados Globales

```
Implementa tests para el manejo de estados globales:
1. Crear tests para stores de estado (si se usa Redux, Zustand, etc.)
2. Verificar interacciones entre componentes y estado global
3. Comprobar persistencia de estado
4. Testear casos de actualización concurrente
```

## Prompt 15: Automatización de Tests de Regresión

```
Configura automatización para tests de regresión:
1. Crear script para ejecutar tests de regresión
2. Configurar comparación de snapshots entre versiones
3. Implementar notificaciones para fallos en tests
4. Configurar ejecución periódica de tests completos
```

## Prompt 16: Mantenimiento y Mejora Continua

```
Establece un plan de mantenimiento y mejora continua:
1. Crear script para analizar rendimiento de los tests
2. Implementar rotación de tests (ejecutar subconjuntos en CI para optimizar tiempo)
3. Establecer proceso de revisión de tests en PRs
4. Configurar alertas para cobertura decreciente
```

## Guía de Uso para el Agente IA

1. Ejecuta los prompts en orden secuencial
2. Antes de pasar al siguiente prompt, verifica que el paso actual se ha completado correctamente
3. Adapta los prompts según los resultados del análisis inicial
4. Documenta los cambios realizados en cada paso
5. Verifica que los tests se ejecuten correctamente después de cada modificación

## Notas Adicionales

- Prioriza siempre la calidad sobre la cantidad de tests
- Sigue el enfoque de testing orientado al comportamiento
- Mantén los mocks al mínimo necesario
- Documenta los patrones y decisiones importantes

# Testing Agent Prompts

## Continuous Integration

- Configurar GitHub Actions para ejecutar tests en paralelo.
- Utilizar caching para dependencias y resultados de pruebas.
- Asegurar que los tests se ejecuten en cada push y pull request.

## Pruebas de Regresión

- Añadir pruebas de regresión automáticas para detectar fallos introducidos por cambios recientes.
- Configurar notificaciones para fallos en las pruebas de regresión.
```