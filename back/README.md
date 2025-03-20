# Documentación de la carpeta back

## Propósito
Esta carpeta contiene la infraestructura de backend para flujos de trabajo de IA y generación de documentación automática. Se utiliza principalmente para alojar prompts y flujos de trabajo de PromptFlow, una herramienta para crear, ejecutar y desplegar flujos de trabajo de IA.

## Estructura
```
back/
├── etc/                  # Configuraciones y recursos externos
│   ├── flows/            # Flujos de trabajo de PromptFlow
│   │   ├── .vscode/      # Configuración de VS Code específica para flujos
│   │   └── flow_doc_codigo/ # Flujo para documentación automática de código
│   └── prompts/          # Plantillas de prompts para modelos de IA
```

## Componentes Principales

### Flujos (etc/flows)
La carpeta `flows` contiene flujos de trabajo de PromptFlow, que son configuraciones para automatizar tareas usando modelos de IA:

- **flow_doc_codigo/**: Un flujo de trabajo diseñado para generar documentación de código automáticamente.
  - `flow.dag.yaml`: Define la estructura del flujo de trabajo y sus nodos
  - `hello.jinja2`: Plantilla Jinja para generación de prompts
  - `hello.py`: Script Python utilizado en el flujo de trabajo
  - `requirements.txt`: Dependencias para el flujo de trabajo
  - `data.jsonl`: Datos de entrada para el flujo

### Prompts (etc/prompts)
La carpeta `prompts` contiene definiciones de prompts utilizadas en los flujos o de forma independiente:

- `basic.prompty`: Prompt básico
- `doc_generator.prompty`: Sistema de generación de documentación recursiva de código usando Meta-Llama-3.1-8B-Instruct

## Uso

### Uso del generador de documentación
El flujo de documentación de código permite generar documentación recursiva para una estructura de código. Para utilizarlo:

1. Asegúrate de tener PromptFlow instalado
2. Navega al directorio `back/etc/flows/flow_doc_codigo`
3. Ejecuta el flujo con los parámetros adecuados (folderPath, parentDoc, depth)

```bash
pf run flow.dag.yaml -i text="Ruta a documentar"
```

### Uso de prompts
Los archivos .prompty pueden ser utilizados con sistemas compatibles con este formato, proporcionando plantillas para la generación de texto estructurado.

## Notas
- El sistema está configurado para usar el modelo Meta-Llama-3.1-8B-Instruct a través de Azure AI services.
- Los flujos de trabajo requieren configuración adecuada de endpoints y credenciales, que deben establecerse en archivos .env (que están en .gitignore).
- Este backend está diseñado para integrarse con la estructura principal de Kimfe y proporcionar servicios de IA para la documentación y otras tareas automatizadas.