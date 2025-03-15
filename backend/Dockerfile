#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See LICENSE file in the project root for license information.
#-------------------------------------------------------------------------------------------------------------

    FROM llamaindex/llama-deploy:v0.3.6

    USER root
    
    # Update the OS and install necessary packages
    ENV DEBIAN_FRONTEND=noninteractive
    RUN apt-get update
    RUN apt-get upgrade -y
    RUN apt-get -y install --no-install-recommends build-essential npm
    RUN apt-get autoremove -y
    RUN apt-get clean -y

    ENV DEBIAN_FRONTEND=dialog
    
    # Update pip
    RUN pip install --upgrade pip
    
    # Install Python dependencies
    RUN pip install llama-index-readers-web
    RUN pip install python-pptx
    RUN pip install docx2txt 
    RUN pip install llama-agents
    RUN pip install llama-index-agent-openai
    RUN pip install llama-index-embeddings-openai
    RUN pip install llama-index-program-openai
    RUN pip install llama-index-llms-openrouter
    RUN pip install llama-index-embeddings-azure-openai 
    RUN pip install transformers
    RUN pip install torch
    RUN pip install sentence-transformers
    RUN pip install openai
    RUN pip install llama-index-readers-database
    RUN pip install openai
    RUN pip install nltk
    RUN pip install llama-index-vector-stores-supabase
    RUN pip install openpyxl
    RUN pip install ipywidgets
    RUN pip install IPython
    RUN pip install llama-index-readers-google
    RUN pip install llama-index.experimental
    RUN pip install aiohttp
    RUN pip install python-docx
    RUN pip install json-repair
    RUN pip install json5

    COPY run.sh /app/run.sh
    RUN chmod +x /app/run.sh
