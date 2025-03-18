
- Toda la arquitectura del proyecto se encuentra en [Docs/arquitectura.md](../Docs/arquitectura.md). Mantén este archivo siempre actualizado si haces cambios en la la estructura del proyecto. 
- Antes de resolver cualquier problema o corrección de errores y bugs, siempre revisa el archivo [bug_fixer.md](../Docs/bug_fixer.md) para tus promps de sistema y contexto.
- Siempre que vayas a desarrollar una nueva característica o funcionalidad (feature), accede a las instrucciones en [Feature_solver.md](../Docs/feature_solver.md)
- Prefiere pnpm para instalación y uso de repositorios y el entorno es de desarrollo, por lo que prefiere pnpm dev para iniciar el servidor de desarrollo.
- Las variables de entorno se encuentran en .env.local
- Siempre recuerda que el back de este proyecto ha sido montado mediante el CLI de supabase para un entorno docker y que sus variables de entorno se encuentran en [.env.local](../.env.local)
- Al documentar issues o problemas sigue el siguiente formato:
```markdown

# Problema o Feature [nombre del problema o feature]

Assignees: 
Labels: 
Milestone: 
Projects: Kimfe

## Descripción del problema o feature
<!-- Describe el problema o la funcionalidad que se desea implementar. Se lo más descriptivo posible para que el agente de IA pueda entenderlo sin necesidad de información adicional. Añade también los pasos para reproducir el problema si es un bug. -->

## Plan de Acción
<!-- Describe el paso a paso a seguir para que el agente de IA pueda resolver el problema. Se lo suficientemente descriptivo para que no requiera información adicional -->
[]- [ ] Tarea 1
[]- [ ] Tarea 2
[]- [ ] Tarea n

## Rutas involucradas
<!-- Enlaces a los archivos o carpetas involucrados. Pueden añadirse páginas web si como documentación de referencia  -->
1.- [Ruta 1]()
2.- [Ruta 2]()
3.- [Ruta n]()

## Pruebas y definición de listos
<!-- Describe el listado de comprobaciones a realizar para asegurar el cumplimiento de la tarea  -->

[]- [ ] Comprobación 1
[]- [ ] Comprobación 2
[]- [ ] Comprobación n

## Notas adocionales

<!--analiza la descripción del problema añade toda la información que consideres relevante añadir para la resolución del problema en esta sección  -->
``` 