## Objetivo: Guardar en BDD una lista de bloques

## ERRORES:

### Template Canva
app-index.tsx:25 
 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render. Error Component Stack
    at ValidationPanel (validation-panel.tsx:19:35)
 

*Explicacion*
El error "Maximum update depth exceeded" ocurre cuando un componente de React entra en un bucle infinito de actualizaciones de estado. En tu caso, el problema parece estar en el componente ValidationPanel dentro de validation-panel.tsx.


react-dom.development.js:27944  Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.

Check the render method of `VisualEditor`.