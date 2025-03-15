#!/bin/bash
# Nota: nohup generalmente ya está incluido en la mayoría de distribuciones Linux
# como parte de las utilidades básicas, por lo que no suele ser necesario añadirlo
# como dependencia explícita en el Dockerfile

# Ejecuta run_core.py en background, desatado de la consola
nohup python /app/run_core.py > /dev/null 2>&1 &

# Espera un momento para asegurarse de que run_core.py inicie
sleep 2

# Ejecuta llama-run.sh con el argumento deseado, también desatado
nohup /app/llama-run.sh -f deploy.py > /dev/null 2>&1 &
