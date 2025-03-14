from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
    SimpleMessageQueueConfig,
)

from workflows.agent_workflow import build_agentic_workflow, AgenticWorkflow
from workflows.rag_workflow import build_rag_workflow
from workflows.evaluation_workflow import EvaluationWorkflow
from workflows.train_workflow import TrainWorkflow
from workflows.thread_workflow import ThreadWorklfow
from workflows.course_creator_workflow import CourseCreatorWorkflow
from workflows.sumary_workflow import SummaryWorkflow
from workflows.feedback_worflow import FeedbackWorkflow
from workflows.delete_emmbedings_workflow import DeleteWorkflow
from workflows.conserge_workflow import build_conserge_workflow
from workflows.doc_writer_workflow import DocumentResearchAgent
from workflows.kimfe.doc_write import KimfeDocWrite


async def main():
    
    host = "0.0.0.0"
    timeout = 36000
    
    import asyncio
    
    
    doc_writer = asyncio.create_task(
        deploy_workflow(
            workflow=DocumentResearchAgent( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8002, service_name="doc_writer"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    agentic_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=build_agentic_workflow( build_rag_workflow() ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8003, service_name="agentic_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    thread_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=ThreadWorklfow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8004, service_name="thread_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    evaluation_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=EvaluationWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8005, service_name="evaluation_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    train_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=TrainWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8006, service_name="train_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    sumary_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=SummaryWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8007, service_name="sumary_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    feedback_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=FeedbackWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8008, service_name="feedback_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    delete_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=DeleteWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8009, service_name="delete_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
    course_creator_workflow = asyncio.create_task(
        deploy_workflow(
            workflow=CourseCreatorWorkflow( timeout=timeout, verbose=True ),
            workflow_config=WorkflowServiceConfig(
                host=host, port=8010, service_name="course_creator_workflow"
            ),
            control_plane_config=ControlPlaneConfig(),   
        )
    )
    
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
        agentic_workflow, 
        doc_writer, 
        thread_workflow, 
        evaluation_workflow, 
        train_workflow,
        sumary_workflow,
        feedback_workflow,
        delete_workflow,
        course_creator_workflow,
        kimfre_doc_write_workflow
    )

    
    



if __name__ == "__main__":
    import asyncio
    asyncio.run(main())