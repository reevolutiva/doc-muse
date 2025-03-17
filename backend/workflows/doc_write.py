from typing import List
from llama_index.core.workflow import (
    step,
    Event,
    Context,
    StartEvent,
    StopEvent,
    Workflow,
)
# Actualizada la importación de JsonSerializer para usar la ruta correcta
from llama_index import JsonSerializer  # updated import based on the new library structure
from conf.models import azure_llm
from conf.KimfeRag import KimfeRag
from llama_index.core import Settings
from pydantic import BaseModel
import json


# -----------------------------
# Pydantic Models
# -----------------------------

class CustomBlock(BaseModel):
    data: dict
    type: str
    system: str
    description: str
    blockId: str
    
    
# -----------------------------
# Eventos y Contextos
# -----------------------------

class ContextEvent(Event):
    context: List[dict]

class KimfeDocWrite(Workflow):
    
    def kimbfe_query( self, query ):
        
        kimfeRag = KimfeRag( "kimfe" )
        kimfeRag.load_storage()
        return kimfeRag.query( query )
    
    def load_block( self, block ):
        
        customBlock = CustomBlock(**block)
        
        type = customBlock.type
        data = customBlock.data
        system = customBlock.system
        description = customBlock.description
        blockId = customBlock.blockId
        
        return { "type": type, "data": data, "system": system, "description": description, "blockId": blockId }
        
    def generate_prompt(self, block: CustomBlock):
        prompt = "Eres un asistente de IA experto en construccion de documentos. \n"
        prompt += block.system + "\n"
        prompt += f"Tu tarea es generar un bloque de: {block.type} {block.description}.  \n"
        return prompt
    
    #INPUT = CustomTemplateDocumnet<CustomTemplateDocumnet>
    @step
    def generate_context(self, event: StartEvent, context: Context) -> ContextEvent:
        salida = []
        template = event.get("template", {})
        blocks = template.get("blocks", [])

        for block in blocks:
            custom_block = CustomBlock(**block)
            prompt = self.generate_prompt(custom_block)
            salida.append({"blockId": custom_block.blockId, "type": custom_block.type, "prompt": prompt})
            
        
        #print(salida)

        return ContextEvent(context=salida)
    
    @step
    def generate_text( self, event: ContextEvent, context: Context ) -> StopEvent:
        
        salida = []
        blocks = event.context
        
        
        
        for block in blocks:
            
            prompt = block["prompt"]
            response = self.kimbfe_query( prompt )
            print(response)
            salida.append( { "blockId": block["blockId"], "response": response.response } )

        return StopEvent( result=json.dumps(salida) )
            
    
    #Process
    # Itera la lista de bloques
    # Por cada bloque, genera uno o mas parrafos de texto usando trainerbot.complete
    # Guarda cada salida en una variable de salida como un texto adjuntando un salto de linea

    #OUTPUT = CustomDocument<str>