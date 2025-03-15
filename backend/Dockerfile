#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See LICENSE file in the project root for license information.
#-------------------------------------------------------------------------------------------------------------

# Dockerfile for the backend service
# This Dockerfile sets up the backend environment, installs necessary dependencies, and ensures the run.sh script has execution permissions.
# It will be used when building the backend service container.

FROM llamaindex/llama-deploy:v0.3.6

USER root

# Update the OS and install necessary packages
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get -y install --no-install-recommends build-essential npm && \
    apt-get autoremove -y && \
    apt-get clean -y
ENV DEBIAN_FRONTEND=dialog

# Update pip and install Python dependencies
RUN pip install --upgrade pip && \
    pip install llama-index-readers-web python-pptx docx2txt llama-agents \
    llama-index-agent-openai llama-index-embeddings-openai llama-index-program-openai \
    llama-index-llms-openrouter llama-index-embeddings-azure-openai transformers torch \
    sentence-transformers openai llama-index-readers-database openai nltk \
    llama-index-vector-stores-supabase openpyxl ipywidgets IPython \
    llama-index-readers-google llama-index.experimental aiohttp python-docx \
    json-repair json5

# Create app directory and copy files
WORKDIR /app
COPY conf/ /app/conf/
COPY data/ /app/data/
COPY workflows/ /app/workflows/
COPY *.py /app/
COPY *.sh /app/

# Ensure scripts have execution permissions
RUN chmod +x /app/*.sh

# Set the default command
CMD ["/app/run.sh"]
