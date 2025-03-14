from typing import List
from llama_index.core.workflow import (
    step,
    Event,
    Context,
    StartEvent,
    StopEvent,
    Workflow,
)
from workflows.core.conf import azure_llm, init_llama_log
from llama_index.core import Settings
from pydantic import BaseModel
import json

Settings.llm = azure_llm
from workflows.core.trainerbot import TrainerBot
trainerbot = TrainerBot()

class CustomBlock(BaseModel):
    data: List
    type: str
    system: str
    description: str

class CustomTemplateDocumnet(BaseModel):
    blocks: List[CustomBlock]

class KimfeDocWrite(Workflow):
    
    def generate_prompt( self , block, title, description ):
        
        prompt = "Eres un asistente de IA experto en construccion de documentos. \n"
        prompt += "Tu tarea es generar un documento a partir de los bloques de texto que se te proporcionan. \n"
        prompt += "El titulo del documento es: " + title + ".\n"
        prompt += "La descripcion del documento es: " + description + ".\n"
        prompt += "El tipo de Bloque es: " + block.get("type") + ".\n"
        prompt += "La descripcion del Bloque es: " + block.get("description") + ".\n"
        prompt += "Contexto: " + block.get("system") + ".\n"
        prompt += "Información adicional: " +  json.dumps( block.get("data") )  + ".\n"
        
        return prompt
    
    #INPUT = CustomTemplateDocumnet<CustomTemplateDocumnet>
    @step
    def prosses_docs(self, event: StartEvent, context: Context) -> StopEvent:
        
        salida = ""
        
        blocks = event.get( "blocks" )
        title = event.get( "title" )
        description = event.get( "description" )
        
        count = 1
        for block in blocks:
            print( block )
            print( count )
            prompt = self.generate_prompt( block, title, description )
            #print( prompt )
            response = trainerbot.complete(prompt)
            print( response )
            salida += response.text + "\n"
            count += 1
            
        return StopEvent( salida )
            
    
    #Process
    # Itera la lista de bloques
    # Por cada bloque, genera uno o mas parrafos de texto usando trainerbot.complete
    # Guarda cada salida en una variable de salida como un texto adjuntando un salto de linea

    #OUTPUT = CustomDocument<str>