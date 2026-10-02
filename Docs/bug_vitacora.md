# Bug Vitácora para Agentes IA

## Índice
- [Instrucciones para el Agente](#instrucciones-para-el-agente)
- [Problemas Activos](#problemas-activos)
- [Último Problema Resuelto](#último-problema-resuelto)
- [Plan de Verificación](#plan-de-verificación)

## Instrucciones para el Agente

Este documento sirve como bitácora de problemas en Doc-Muse y guía para agentes IA que asisten en su resolución. Para trabajar eficientemente:

1. **Revisar problemas activos** antes de empezar cualquier tarea
2. **Seguir el formato estándar** para documentar nuevos problemas o actualizaciones
3. **Actualizar el estado** de los problemas según se resuelvan
4. **Aplicar las verificaciones** del plan de monitoreo tras cada cambio

## Problemas Activos

### Problema Nº22: Incidente P0 de exposición de credenciales

Assignees: Pendiente de designación por los administradores
Labels: security, P0
Milestone: Pendiente
Projects: Kimfe

#### Descripción del problema o feature

**Abierto; contención parcial.** Auditoría local del 2026-10-02: cuatro credenciales potencialmente comprometidas (Etherpad, dos OpenAI y una Azure OpenAI), sin verificar vigencia ni uso indebido. No se publican valores ni hashes de credenciales. Se recuperaron todas las ramas y tags anunciados por el remoto: 16 ramas, ningún tag, 177 commits anteriores a esta intervención; revisión del especialista sobre 178 commits incluidos los controles y 1.147 blobs. No cubre refs borradas/ocultas de PR, forks, clones, logs, artefactos o releases.

Inventario mínimo, con referencias relativas a la raíz:

| ID | Proveedor / alcance | Ruta y referencia inicial | Estado / evidencia administrativa |
| --- | --- | --- | --- |
| SEC-01 | Etherpad; clave del cliente, servicio configurado localmente | `src/components/document-config/config/keys.js:1`, `7677054d4f134e9f4a7c732eeeec760233198599`; usada por `config/etherpad.js` | Literal y encabezado retirados del árbol actual. Revocación por operador **pendiente**, sin evidencia. |
| SEC-02 | OpenAI; clave histórica de backend | `backend/conf/globals.py:3`, `cdbc625aca69ce8fdbaa31f0bfeac781b5730547`; también `backend/test.py:18`, `d86fe2ad45a2b18823f9b3154ab2e36186c11b19` | Archivos ya ausentes del árbol, recuperables del historial. Revocación y revisión de consumo **pendientes**, sin evidencia. |
| SEC-03 | OpenAI; segunda clave histórica | `back/docs/Example/chat-with-pdf/openai.yaml:5`, `e8917f061d3e17d6c51c3850c6aca2262ac83b30` | Revocación y revisión de consumo **pendientes**, sin evidencia. |
| SEC-04 | Azure OpenAI; misma clave en configuración, script y notebook | `backend/conf/models.py:3` y `backend/test.py:12`, `d86fe2ad45a2b18823f9b3154ab2e36186c11b19`; `back/docs/Example/chat-with-pdf/chat-with-pdf.ipynb:250`, `e8917f061d3e17d6c51c3850c6aca2262ac83b30` | Regeneración de clave por operador de Azure, actualización de consumidores y revisión de uso **pendientes**, sin evidencia. |

No se clasifican como secretos de producción las claves Supabase con rol `anon` (públicas), el JWT `service_role` del entorno `supabase-demo` local ni placeholders de conexiones. Su seguridad depende de aislamiento local/RLS; deben reevaluarse si se usaron fuera de desarrollo. Se retiró de Docker la variable pública destinada a `service_role`, sin consumidores encontrados.

#### Plan de Acción

- [x] Revisar instrucciones, recuperar historial anunciado y registrar inventario sin valores.
- [x] Retirar clave Etherpad del cliente; ignorar variantes `.env*`, informes privados y caché `supabase/.temp`.
- [x] Añadir escaneo CI y hook local, con salida redactada y sin baseline histórica.
- [x] Extender detección a asignaciones escapadas en notebooks y limitar excepciones a datos de prueba verificados.
- [x] Recuperar `.env.example` vacío; parametrizar URLs Etherpad y configuración de inferencia externa; unificar `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Alinear Compose con `--env-file .env.local`, build Docker con argumentos exclusivamente públicos y salida Next.js `standalone`; retirar metadatos locales versionados.
- [ ] Designar responsables, pausar despliegues afectados y revocar SEC-01 a SEC-04; actualizar consumidores y comprobar que las claves anteriores no autentican.
- [ ] Completar inventario de secret scanning, refs de PR, releases, logs y artefactos con acceso administrativo; revisar actividad y facturación.
- [ ] Saneamiento histórico coordinado mediante `git-filter-repo`, todas las rutas/copias y refs afectadas; limpieza de cachés GitHub y reclonado de colaboradores.
- [ ] Exigir el check `Secret scan / secrets` (árbol versionado) en ramas protegidas, activar secret scanning y push protection de GitHub, y confirmar el hook en cada clon (`pnpm run setup:hooks`).

#### Rutas involucradas

1.- [Cliente Etherpad](../src/components/document-config/config/etherpad.js)
2.- [Escaneo CI](../.github/workflows/secrets.yml)
3.- [Hook local](../.githooks/pre-commit)
4.- [Política y procedimiento administrativo](../README.md#política-de-secretos-y-respuesta-a-incidentes)
5.- [Configuración Docker](../docker-compose.yml)

#### Pruebas y definición de listos

- [x] Hook con sintaxis shell válida y modo ejecutable; workflow YAML, eventos, permisos mínimos y fetch completo verificados.
- [x] Exclusiones `.env`, `.env.local`, `.env.production` y variantes anidadas; `.env.example` sigue versionable.
- [x] Gitleaks descargado con checksum verificado; credencial sintética de alta entropía bloqueada. No detectó una muestra artificial de entropía nula: no reemplaza la revisión manual.
- [x] Regla de notebooks validada con JSON sintético escapado y salida completamente redactada; las reglas predeterminadas no detectaban la copia Azure en el notebook histórico.
- [x] Sintaxis JavaScript del cliente Etherpad y `git diff --check` correctos.
- [ ] Lint: bloqueado por `.eslint.js` inexistente; tests: configuración Jest CommonJS incompatible con el paquete ESM; build: descarga de Inter bloqueada por DNS de `fonts.googleapis.com`. Fallos ajenos a la remediación, sin modificar sus configuraciones.
- [ ] Evidencia privada de revocación por ID: responsable, UTC, evento del proveedor, verificación de clave anterior y despliegue con sustituta.
- [ ] Historial saneado y escaneado, revisión de accesos e integración Supabase/Etherpad tras rotación.

#### Notas adocionales

**Postmortem preliminar (UTC):**
- 2026-10-02 17:47: recepción del incidente; exposición y fecha de publicación aún desconocidas.
- 17:48–17:50: revisión de instrucciones y ampliación de historial; inventario local por especialista.
- 17:50: publicados controles preventivos y política (`9cf155f`).
- En esta intervención: retirada de la clave cliente y del nombre público de `service_role`; la integración Etherpad requiere credencial rotada y autorización en el middleware.

**Causa observada:** credenciales literales en código cliente, configuración Python y ejemplos/notebooks históricos, sin controles preventivos efectivos observados antes de la intervención. **Impacto:** exposición de valores confirmada localmente; vigencia, ventana de exposición y abuso desconocidos. **Contención externa:** no se ejecutaron rotaciones, congelación de despliegues ni cambios de visibilidad/protecciones. No se reescribió el historial remoto: un commit de saneamiento no purga valores previos. El CI histórico debe seguir fallando mientras existan credenciales detectables, no silenciarse para cerrar el incidente. La meta de 24 horas sigue pendiente y requiere responsables con acceso a proveedores y administración GitHub.

**Validación adicional:** escaneo histórico predeterminado sobre 179 commits: 186 avisos (duplicados y falsos positivos, no 186 secretos). En archivos versionados del árbol actual, 86 avisos eran UUID del seed y uno un ejemplo truncado de clave pública; se revisan por formato y contexto, no se convierten en credenciales comprometidas. CodeQL para Actions/JavaScript: cero alertas. El motor automatizado de revisión no estaba disponible; revisión especializada del diff sin bugs de alta confianza. Los controles siguen sin acreditar una ejecución CI exitosa ni obligatoriedad de protección de ramas.

**Escaneo final con `.gitleaks.toml`:** cero avisos en archivos versionados del árbol actual; 19 avisos históricos, incluidos duplicados de credenciales y claves públicas/ejemplos. Etherpad, Azure en Python y Azure en el notebook siguen detectados; ninguna excepción oculta esas credenciales. Las excepciones de `generic-api-key` combinan ruta exacta y match exacto para UUID del método `password` en el seed y cabecera JWT truncada en la guía. El escaneo local de directorio también señala 15 avisos en `.next`, fuera de lo versionado: revisar/reconstruir los artefactos antes de desplegar y no confundirlos con nuevos secretos confirmados.

**Ajuste solicitado el 2026-10-02 18:15 UTC:** el alcance de esta remediación es normalizar código y variables para un despliegue genérico; la renovación/revocación de keys corresponde al propietario, no se ejecuta desde esta tarea. Se restauró `.env.example` sin valores, se eliminaron endpoints/modelos fijados a un despliegue y la dependencia del alias `NEXT_PUBLIC_SUPABASE_KEY`, y se retiraron archivos de `supabase/.temp` del árbol. Los puertos y URLs loopback de `supabase/config.toml` son defaults del entorno CLI local, no credenciales ni configuración de un proyecto remoto.

**Verificaciones del ajuste:** sintaxis JS/shell y `git diff --check` correctos; Compose validado con URL/clave públicas sintéticas, sin variables privadas declaradas; plantilla con valores vacíos, versionable y `.env.local` ignorado; esquema de entorno acepta Supabase configurado y Etherpad vacío opcional, y las URLs respetan variables de prueba sin fallback local. Instalación pnpm con lockfile congelado correcta. Lint y Jest siguen bloqueados por los errores de configuración ya indicados; typecheck falla por sintaxis JSX en `project-templates/ProjectList.ts:19–35`; build sigue bloqueado por descarga de fuentes. No se alteraron esas configuraciones ajenas ni se validó un despliegue real con credenciales del propietario. Revisión de seguridad especializada: sin vulnerabilidades nuevas encontradas.

**Limpieza histórica solicitada, aún no ejecutada:** los commits publicados siguen siendo incrementales. Esta rama no puede purgar el historial remoto ni actualizar forzosamente todas las ramas/tags. Un administrador debe elegir entre sanear secretos conservando historia o reinicializarla por completo, congelar escrituras, guardar un respaldo privado y operar sobre una copia aislada con todas las refs. Para saneamiento, usar `git-filter-repo` con eliminación de las rutas históricas del inventario y `src/components/document-config/config/keys.js`, incluyendo sus renombrados y `supabase/.temp/`; usar archivos privados de reemplazos para valores copiados en otras rutas y mensajes. No incluir esos archivos en el repositorio ni en comandos/logs públicos. Revisar todas las refs resultantes con Gitleaks antes de publicarlas mediante el canal administrativo autorizado. La actualización de refs, cachés de GitHub/PR, artefactos, forks y reclonado de colaboradores es imprescindible; borrar `.git` aquí o crear un commit huérfano no sanea el repositorio público. Hasta esa operación el historial sigue expuesto; normalizar variables no invalida las claves antiguas.

**Ajuste de controles del 2026-10-02 (CI):** el workflow `Secret scan` se separó en dos jobs para eliminar la contradicción entre *exigir* el check y *no silenciar* los hallazgos históricos: `secrets` escanea el árbol versionado y puede exigirse ya en la protección de ramas; `history` escanea el historial completo con `continue-on-error` y **sigue fallando visiblemente** hasta que se ejecute el saneamiento (19 avisos en 11 commits sobre 17 refs, reproducido con Gitleaks 8.30.1 y el checksum del workflow). El check `Secret scan / secrets` no debe declararse exigido hasta confirmar su primera ejecución verde. Las ejecuciones anteriores del workflow quedaron en `action_required` por aprobación pendiente de un administrador, de modo que el control no contaba con evidencia de ejecución en CI.

### Problema Nº21: Error de tipo en configuración de ESLint
- **Resuelto:** No
- **Descripción:** Type error: Type 'string' has no properties in common with type 'Plugin'. El mensaje indica que ESLint espera que `plugins` sea un objeto en lugar de un arreglo de cadenas.
- **Solución propuesta:**
  - **Opción A:** Usar configuración clásica (.eslintrc) y un array de strings en `plugins`.
    1. Renombrar archivo a `.eslintrc.js` o `.eslintrc.cjs`.
    2. Eliminar anotación de tipo JSDoc.
    3. Asegurarse de que no exista un `eslint.config.js` o `eslint.config.cjs`.
    4. Actualizar dependencias de ESLint y plugins.
  - **Opción B:** Migrar a la “flat config” en `eslint.config.js`.
    1. Definir `plugins` como un objeto.
    2. Usar `FlatCompat` para migrar reglas de `.eslintrc` a configuración plana.
- **Notas adicionales:** Verificar si el proyecto está usando la “flat config” y revisar versiones de `eslint` y plugins en `package.json`.
## Último Problema Resuelto

### Problema Nº20: Duplicación completa del frontend
- **Resuelto:** Sí
- **Descripción:** Se detectó duplicación de implementaciones frontend (en `src/` y en otros directorios), así como múltiples Dockerfiles que generaban confusión sobre la configuración correcta.
- **Solución aplicada:** 
  - Se analizaron implementaciones para determinar la más actualizada
  - Se verificaron referencias en docker-compose.yml
  - Se eliminó implementación obsoleta manteniendo la documentada
  - Se consolidaron los Dockerfiles

## Plan de Verificación

# Bug Vitacora

## Fecha: [Fecha Actual]

### Descripción del Problema
- [Descripción detallada del problema encontrado]

### Componentes Afectados
- [Lista de componentes afectados]

### Pasos para Reproducir
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

### Solución Propuesta
- [Descripción de la solución propuesta]

### Notas Adicionales
- [Cualquier nota adicional relevante]
