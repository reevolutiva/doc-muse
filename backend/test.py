import asyncio
from workflows.doc_write import KimfeDocWrite

kimfe_w = KimfeDocWrite( timeout=500.0, verbose=True )

async def test_kimfe():
        
    template = {
        "time": 1710355800000,
        "blocks": [
            {
            "blockId": "header-001",
            "type": "header",
            "data": {
                "text": "[Nombre de plantilla]"
            },
            "description": "Plantilla para la generación de documentos educativos",
            "system": "A partir de la información entregada por el usuario, genera un [Nombre de plantilla]"
            },
            {
            "blockId": "objective-001",
            "type": "paragraph",
            "data": {
                "text": "[template_desription]"
            },
            "description": "Define brevemente el objetivo principal al que apunta esta plantilla.",
            "system": "Explain the main objective of this document template in a formal, professional style."
            },
            {
            "blockId": "scope-included-001",
            "type": "list",
            "data": {
                "text": [
                "Punto incluido 1",
                "Punto incluido 2"
                ]
            },
            "description": "Listado de elementos incluidos dentro del alcance de la plantilla.",
            "system": "Create a list of key points included within the scope, clearly stating each item's importance."
            },
            {
            "blockId": "scope-excluded-001",
            "type": "list",
            "data": {
                "text": [
                "Punto excluido 1",
                "Punto excluido 2"
                ]
            },
            "description": "Listado de elementos explícitamente excluidos del alcance.",
            "system": "List items explicitly excluded from the scope, briefly mentioning why they are not included."
            },
            {
            "blockId": "functionality-description-001",
            "type": "paragraph",
            "data": {
                "text": "Descripción de la funcionalidad"
            },
            "description": "Descripción detallada de cómo se utilizará esta plantilla.",
            "system": "Describe in detail the functionality of this document template and how users should apply it effectively."
            },
            {
            "blockId": "functional-requirements-001",
            "type": "list",
            "data": {
                "text": [
                "Requisito funcional 1",
                "Requisito funcional 2"
                ]
            },
            "description": "Lista de requisitos funcionales específicos para esta plantilla.",
            "system": "Create a concise list of functional requirements necessary to use this template properly."
            },
            {
            "blockId": "non-functional-requirements-001",
            "type": "list",
            "data": {
                "text": [
                "Requisito no funcional 1",
                "Requisito no funcional 2"
                ]
            },
            "description": "Lista de requisitos no funcionales importantes para considerar.",
            "system": "List non-functional requirements critical for the effective use of this template, focusing on usability and security."
            },
            {
            "blockId": "use-case-001",
            "type": "paragraph",
            "data": {
                "text": "Descripción del caso de uso"
            },
            "description": "Descripción breve del caso de uso principal de esta plantilla.",
            "system": "Explain the main use case scenario clearly, including the expected actor and interaction steps."
            },
            {
            "blockId": "technical-considerations-001",
            "type": "paragraph",
            "data": {
                "text": "Consideraciones técnicas relevantes"
            },
            "description": "Breve descripción de consideraciones técnicas para la implementación de esta plantilla.",
            "system": "Mention essential technical considerations required for implementing and managing this template."
            },
            {
            "blockId": "success-metrics-001",
            "type": "list",
            "data": {
                "text": [
                "Métrica de éxito 1",
                "Métrica de éxito 2"
                ]
            },
            "description": "Métricas utilizadas para evaluar el éxito del uso de esta plantilla.",
            "system": "Generate a list of key metrics to assess the successful implementation and adoption of this template."
            },
            {
            "blockId": "testing-plan-001",
            "type": "paragraph",
            "data": {
                "text": "Descripción del plan de pruebas"
            },
            "description": "Breve descripción sobre cómo validar la efectividad de esta plantilla mediante pruebas.",
            "system": "Detail briefly a testing plan to validate the effectiveness and usability of this template."
            }
        ],
        "version": "1.0.0"
        }



    
    salida = await kimfe_w.run( 
            template=template
    ) 
    
    print( salida )


asyncio.run(test_kimfe())
