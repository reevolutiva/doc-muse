
## Descripción del ciclo de vida del desarrollo de aplicaciones de modelos de lenguaje grande (LLM)
1. ### inicialización: Definir el caso de uso y diseñar la solución:
    Imagine que desea diseñar y desarrollar una aplicación de LLM para clasificar artículos de noticias. Antes de empezar a crear algo, deberá definir qué categorías desea como salida. Es necesario comprender el aspecto de un artículo de noticias típico, cómo presentar el artículo como entrada a la aplicación y cómo la aplicación genera la salida deseada.
    1. Definir el objetivo
    2. Recopilar un conjunto de datos de ejemplo
    3. Compilar un aviso básico
    4. Diseñar el flujo
    Para diseñar, desarrollar y probar una aplicación de LLM, se necesita un conjunto de datos de ejemplo que actúe como entrada. Un conjunto de datos de ejemplo es un pequeño subconjunto representativo de los datos que espera analizar como entrada para la aplicación de LLM.
    Al recopilar o crear el conjunto de datos de ejemplo, se debería garantizar la diversidad de los datos para cubrir diversos escenarios y casos perimetrales. También se debe quitar cualquier información confidencial de privacidad del conjunto de datos para evitar vulnerabilidades.

2. ### Experimentación: Desarrollar un flujo y probar con un conjunto de datos pequeño:
    Recopiló un conjunto de datos de ejemplo de artículos de noticias y decidió en qué categorías desea que los artículos se clasifiquen. Diseñó un flujo que toma un artículo de noticias como entrada y usa un LLM para clasificar el artículo. Para probar si el flujo genera la salida esperada, ejecútelo en el conjunto de datos de ejemplo.
    La fase de experimentación es un proceso iterativo durante el que (1) ejecuta el flujo en un conjunto de datos de ejemplo. A continuación, (2) evalúa el rendimiento del aviso. Si está (3) satisfecho con el resultado, pase a la evaluación y el refinamiento. Si cree que hay espacio para mejorar, (4) modifique el flujo cambiando el aviso o el propio flujo.
   
3. ### Evaluación y refinamiento: Evalar el flujo con un conjunto de datos mayor:
    Cuando esté satisfecho con la salida del flujo que clasifica los artículos de noticias, en función del conjunto de datos de ejemplo, evalúe el rendimiento del flujo en un conjunto de datos mayor.
    Al probar el flujo en un conjunto de datos más grande, evalúe la forma en que la aplicación del LLM generaliza los nuevos datos. Durante la evaluación, se pueden identificar posibles cuellos de botella o áreas para la optimización o refinamiento.
    Al editar el flujo, primero se debería ejecutar en un conjunto de datos más pequeño antes de volver a ejecutarlo en un conjunto de datos más grande. Probar el flujo con un conjunto de datos más pequeño permite responder más rápidamente a cualquier problema.
    Una vez que la aplicación de LLM parezca sólida y confiable al manejar varios escenarios, se podrá decidir mover la aplicación LLM a producción.
   
4. ### Producción: Implementar y supervisar el flujo y la aplicación:
    Durante la producción, deberá:
    1. Optimizar el flujo que clasifica los artículos entrantes para mejorar la eficiencia y la eficacia.
    2. Implementar el flujo en un punto de conexión. Al llamar al punto de conexión, se desencadena el flujo para ejecutarse y se genera la salida deseada.
    3. Supervisar el rendimiento de la solución mediante la recopilación de datos de uso y los comentarios de los usuarios finales. Al comprender cómo se comporta la aplicación, se puede mejorar el flujo siempre que sea necesario.

    ![Ciclo de Desarrollo](<Pantallazo 2025-03-19 a la(s) 16.48.49.png>)

## Componentes principales de un flujo
    1. Entradas: Representan los datos pasados al flujo. Pueden ser diferentes tipos de datos, como cadenas, enteros o booleanos.
    2. Nodos: Representa herramientas que realizan el procesamiento de datos, la ejecución de tareas o las operaciones algorítmicas.
    3. Salidas: Representa los datos generados por el flujo.

## Herramientas disponibles
    * Herramienta LLM: Habilita la creación de avisos personalizados mediante modelos de lenguaje grande.
    * Herramienta Python: Permite la ejecución de scripts personalizados de Python.
    * Herramienta de aviso: Prepare avisos como cadenas para escenarios complejos o la integración con otras herramientas.

