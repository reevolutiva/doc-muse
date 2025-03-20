# Problema o Feature [Recuperar integración con Etherpad]

Assignees: 
Labels: bug
Milestone: 
Projects: Kimfe

## Descripción del problema o feature
La integración con Etherpad se rompió debido a problemas con la base de datos de Supabase y un harcodeo incorrecto de las credenciales. Esto resultó en una petición inválida a Supabase al intentar obtener la configuración del proyecto, impidiendo que se mostrara el tipo de proyecto en la pestaña de configuración.

## Plan de Acción
- [x] Corregir las relaciones inexistentes en Supabase.
- [x] Asegurarse de que el hook reciba el parámetro correcto (project_id en lugar de template_id).
- [ ] Verificar la conexión con Etherpad después de las correcciones en Supabase.
- [ ] Implementar pruebas unitarias para el hook que obtiene la configuración del proyecto.
- [ ] Validar que la información del tipo de proyecto se muestra correctamente en la pestaña de configuración.

## Rutas involucradas
1.- [src/hooks/useProjectConfig.js]()
2.- [supabase/tables]()
3.- [src/components/ProjectSettings.js]()

## Pruebas y definición de listos
- [x] La petición a Supabase para obtener la configuración del proyecto debe ser válida.
- [x] El tipo de proyecto debe mostrarse correctamente en la pestaña de configuración.
- [ ] La integración con Etherpad debe funcionar como se espera.
- [ ] Las pruebas unitarias para el hook deben pasar.

## Notas adocionales
Es importante revisar el código del hook `useProjectConfig.js` para asegurarse de que está utilizando el `project_id` correcto y que está manejando correctamente las respuestas de Supabase. También, se debe verificar la estructura de las tablas en Supabase para asegurar que las relaciones estén correctamente definidas.


## Rastro de envidencias:
* En src/components/project-edit/create-section.tsx selectedTemplate es null
* Debiera configurase selectedTempalte en el metodo handleCreate
* handleCreate se activa al hacer click en uno de los DOCUMENT_TYPES
* La lista de DOCUMENT_TYPES se hace filtrando availableDocTypes que actualmente es un array vacio
* EhterpadEmbed esta importado correctamente.

[ Mie 19 de Marzo 10:22  ]
Recuperamos Etherpad