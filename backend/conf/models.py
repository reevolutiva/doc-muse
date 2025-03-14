from llama_index.llms.azure_openai import AzureOpenAI

api_key = "4TvPwSX9pxc6ea9aIxalyC5ZwkvgthGYLixN4txH30bfI7F5rZGiJQQJ99BBACYeBjFXJ3w3AAABACOGo2tZ"
azure_endpoint = "https://ReevCL.openai.azure.com/"
api_version = "2024-05-01-preview"
deployment_name = "gpt-4o"


# Configuración del LLM de Azure OpenAI
azure_llm = AzureOpenAI(
    model="gpt-4o",
    deployment_name=deployment_name,
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
)