
from llama_index.core import SimpleDirectoryReader, Document, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.supabase import SupabaseVectorStore
from conf.models import azure_llm
from conf.globals import POSTGRESS_HOST, POSTGRESS_PORT, OPENAI_APIKEY
import os
os.environ["OPENAI_API_KEY"] = OPENAI_APIKEY

class KimfeRag:
    
    def __init__(self, collection_name, llm = azure_llm ):
        self.collection_name = collection_name
        self.vector_store = ""
        self.storage_context = ""
        self.llm = llm
        self.documents = []
        self.vector_index_store = ""
        
    
    def load_documents( self, path ):
        self.documents = SimpleDirectoryReader( path ).load_data()
        
    
    def load_storage( self ):
        
        # Configuración del vector store
        vector_store = SupabaseVectorStore(
            postgres_connection_string=(
                f"postgresql://postgres:postgres@{POSTGRESS_HOST}:{POSTGRESS_PORT}/postgres"
            ),
            collection_name=self.collection_name,
        )
        
        self.vector_store = vector_store
        
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        
        self.storage_context = storage_context
        
        vector_index_store = VectorStoreIndex.from_documents(
            self.documents, storage_context=storage_context
        )
        
        self.vector_index_store = vector_index_store
        
    def query( self, query ):
        query_engine = self.vector_index_store.as_query_engine(llm=self.llm)
        response = query_engine.query(query)
        return response
    
    