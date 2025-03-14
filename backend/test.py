
from llama_index.core import SimpleDirectoryReader, Document, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.llms.azure_openai import AzureOpenAI

documents = SimpleDirectoryReader("/app/data/").load_data()

POSTGRESS_HOST = "host.docker.internal"
POSTGRESS_PORT = "54322"

api_key = "4TvPwSX9pxc6ea9aIxalyC5ZwkvgthGYLixN4txH30bfI7F5rZGiJQQJ99BBACYeBjFXJ3w3AAABACOGo2tZ"
azure_endpoint = "https://ReevCL.openai.azure.com/"
api_version = "2024-05-01-preview"
deployment_name = "gpt-4o"


OPENAI_APIKEY="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"

# Configuración del LLM de Azure OpenAI
azure_llm = AzureOpenAI(
    model="gpt-4o",
    deployment_name=deployment_name,
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
)

# Asegúrate de que el entorno esté configurado correctamente
import os
os.environ["OPENAI_API_KEY"] = OPENAI_APIKEY

collection_name = "paul_graham"

# Configuración del vector store
vector_store = SupabaseVectorStore(
    postgres_connection_string=(
        f"postgresql://postgres:postgres@{POSTGRESS_HOST}:{POSTGRESS_PORT}/postgres"
    ),
    collection_name=collection_name,
)

# Configuración del contexto de almacenamiento
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Creación del índice de la tienda de vectores
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)

# Configuración del motor de consultas con el LLM de Azure OpenAI
query_engine = index.as_query_engine(llm=azure_llm)
#query_engine = index.as_query_engine()
response = query_engine.query("Quien es Paul Graham?")
print(response)