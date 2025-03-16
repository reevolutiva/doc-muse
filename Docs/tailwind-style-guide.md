# Guía de Estilos de Tailwind CSS para Doc-Muse

Esta guía establece los patrones de diseño y uso de clases de Tailwind CSS para mantener la consistencia en toda la aplicación Doc-Muse.

## Espaciado

- Usar múltiplos de 4 para espaciado: `p-4`, `mt-2`, `mb-8`, etc.
- Mantener consistencia en las estructuras de componentes similares
- Para padding:
  - Botones: `px-4 py-2` (pequeños), `px-6 py-3` (medianos)
  - Contenedores: `p-4` (estándar), `p-6` (mayor énfasis)
  - Cards: `p-4` o `px-4 py-3`

## Colores

- Acción primaria: `blue-600`
- Acción secundaria: `gray-600`
- Advertencia/Cancelar: `red-600`
- Éxito: `green-600`
- Información: `blue-500`
- Texto principal: `gray-900`
- Texto secundario: `gray-600`
- Texto terciario: `gray-500`

## Tipografía

- Titulares:
  - H1: `text-3xl font-bold`
  - H2: `text-2xl font-semibold`
  - H3: `text-xl font-semibold`
  - H4: `text-lg font-medium`
- Texto:
  - Normal: `text-base`
  - Pequeño: `text-sm`
  - Muy pequeño: `text-xs`
- Otros:
  - Etiquetas: `text-sm font-medium text-gray-700`
  - Descripciones: `text-sm text-gray-500`
  - Mensajes de error: `text-sm text-red-600`

## Componentes

### Botones

- Primario: `bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors`
- Secundario: `border border-blue-600 text-blue-600 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors`
- Peligro: `bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors`
- Texto: `text-blue-600 hover:underline`
- Deshabilitado: `opacity-50 cursor-not-allowed`

### Tarjetas (Cards)

- Estándar: `bg-white border rounded-lg shadow-sm p-4`
- Destacada: `bg-white border-2 border-blue-600 rounded-lg shadow-md p-4`
- Horizontal: `flex gap-4 bg-white border rounded-lg shadow-sm p-4`

### Inputs

- Estándar: `border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Con error: `border border-red-500 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500`
- Con icono: `pl-10 border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`

### Loaders

- Spinner: `animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600`
- Spinner grande: `animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600`

### Mensajes

- Éxito: `bg-green-50 border border-green-100 text-green-800 rounded-lg p-4`
- Error: `bg-red-50 border border-red-100 text-red-800 rounded-lg p-4`
- Info: `bg-blue-50 border border-blue-100 text-blue-800 rounded-lg p-4`
- Warning: `bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-lg p-4`

## Layouts

- Contenedor principal: `container mx-auto max-w-[1200px]`
- Grid:
  - 2 columnas: `grid grid-cols-1 md:grid-cols-2 gap-4`
  - 3 columnas: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Flex vertical: `flex flex-col gap-4`
- Flex horizontal: `flex items-center gap-4`

## Estado y Retroalimentación

- Hover: `hover:bg-gray-100`, `hover:text-blue-700`
- Focus: `focus:outline-none focus:ring-2 focus:ring-blue-500`
- Active: `active:bg-blue-700`, `active:scale-95`
- Disabled: `opacity-50 cursor-not-allowed`
