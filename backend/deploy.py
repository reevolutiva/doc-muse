from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
    SimpleMessageQueueConfig,
)


from workflows.doc_write import KimfeDocWrite



async def main():
    
    host = "kimfe-backend-plane-conf"
    
    import asyncio
    
    kimfre_doc_write_workflow = asyncio.create_task(
        deploy_workflow(
            workflow= KimfeDocWrite( timeout=500.0, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8011, service_name="kimfew_doc_writer_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    await asyncio.gather(
        kimfre_doc_write_workflow
    )

    
    



if __name__ == "__main__":
    import asyncio
    asyncio.run(main())