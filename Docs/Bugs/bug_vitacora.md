# Bitácora de Corrección de Bugs

## Bug: Errores en el Componente Select

### Descripción
Se detectaron errores en las pruebas del componente `Select` debido a problemas con las exportaciones y los mocks de Radix UI.

### Soluciones Implementadas
1. **Mocks Actualizados**:
   - Se corrigieron los mocks de `@radix-ui/react-select` para incluir todos los subcomponentes necesarios.
   - Se eliminaron referencias a React dentro de la fábrica de mocks para evitar el error de Jest.
2. **Exportaciones Corregidas**:
   - Se aseguraron las exportaciones correctas de los subcomponentes en `select.tsx`.
3. **Pruebas Actualizadas**:
   - Se ajustaron las pruebas para manejar correctamente los componentes compuestos.
4. **Setup de Jest**:
   - Se agregó un mock global para `ResizeObserver` en `jest.setup.cjs`.

### Resultados
- Todas las pruebas del componente `Select` ahora pasan sin errores.
- La cobertura de código del componente es adecuada.
- Las interacciones de usuario funcionan correctamente.

## Bug: Errores en Tests de TemplateNode

### Descripción
Se detectaron errores en las pruebas del componente `TemplateNode` indicando componente indefinido.

### Soluciones Implementadas
1. **Creación de Mocks**:
   - Se implementaron mocks para las dependencias de ReactFlow.
   - Se aseguró la exportación correcta del componente TemplateNode.
2. **Estructura de Pruebas**:
   - Se actualizaron los casos de prueba para utilizar correctamente los props.

### Resultados
- Las pruebas del componente TemplateNode ahora se ejecutan correctamente.
- Los mocks de ReactFlow permiten probar el componente de manera aislada.

## Bug: Errores en Tests de Canvas y DocumentList

### Descripción
1. Se detectaron errores de selectores en las pruebas de Canvas (usando 'reactflow' en lugar de 'rf__wrapper').
2. Se detectaron errores en las pruebas de DocumentList al buscar elementos por data-testid.

### Soluciones Implementadas
1. **Canvas Test**:
   - Se actualizaron los selectores para usar los testId que ReactFlow realmente genera.
2. **DocumentList Test**:
   - Se modificaron los selectores para usar clases en lugar de data-testid.

### Resultados
- Todas las pruebas ahora pueden encontrar correctamente los elementos del DOM.
- Se mejoró la resiliencia de las pruebas frente a cambios en los componentes.

### Próximos Pasos
- Monitorear posibles regresiones en futuras actualizaciones de las dependencias.
- Revisar otros componentes que utilicen ReactFlow o Radix UI para asegurar consistencia.
- Considerar la implementación de una biblioteca de mocks más robusta para componentes externos.
