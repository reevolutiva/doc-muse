# Dockerfile for the backend service

FROM python:3.11-slim-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    npm \
    procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    python-pptx \
    docx2txt \
    llama-index \
    llama-index-core \
    llama-deploy \
    transformers \
    torch \
    sentence-transformers \
    openai \
    openpyxl \
    ipywidgets \
    IPython \
    aiohttp \
    python-docx \
    json-repair \
    json5 \
    nltk

# Create app directory and copy files
WORKDIR /app
COPY conf/ /app/conf/
COPY data/ /app/data/
COPY workflows/ /app/workflows/
COPY *.py /app/
COPY *.sh /app/

# Ensure scripts have execution permissions
RUN chmod +x /app/*.sh

# Install NLTK data
RUN python -m nltk.downloader punkt

# Create a simple health check endpoint
COPY health_check.py /app/
RUN chmod +x /app/health_check.py

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["/app/run.sh"]
