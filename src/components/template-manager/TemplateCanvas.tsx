import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import TemplateNode from './TemplateNode';
import TemplatePalette from './TemplatePalette';
import PropertiesPanel from './PropertiesPanel';
import { templateService } from '@/lib/services/template.service';

const nodeTypes = {
  document: TemplateNode,
  project: TemplateNode,
};

let id = 1;
const getId = () => `node_${id++}`;

const TemplateCanvasContent = () => {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [title, setTitle] = useState('Untitled Template');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar la plantilla si hay un ID
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return;

      try {
        setIsLoading(true);
        const template = await templateService.getTemplate(templateId);
        if (template.visual_data) {
          setNodes(template.visual_data.nodes);
          setEdges(template.visual_data.edges);
        }
        setTitle(template.title);
        setDescription(template.description);
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Failed to load template');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    
    // Guardar la dependencia en la base de datos
    if (templateId) {
      templateService.saveDependency(params.source, params.target, {
        type: 'template_connection'
      }).catch(error => {
        console.error('Error saving dependency:', error);
        toast.error('Failed to save connection');
      });
    }
  }, [setEdges, templateId]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: `New ${type}`, 
          type,
          description: `Description for ${type}`,
          isRequired: false,
          prompt: ''
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPanelClose = () => {
    setSelectedNode(null);
  };

  const onNodeUpdate = (id, data) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...data,
            },
          };
        }
        return node;
      })
    );
  };

  const saveTemplate = async () => {
    try {
      setIsLoading(true);
      const templateData = {
        title,
        description,
        visual_data: {
          nodes,
          edges
        }
      };

      if (templateId) {
        await templateService.updateTemplate(templateId, templateData);
        toast.success('Template updated successfully');
      } else {
        const newTemplate = await templateService.saveTemplate(templateData);
        // Redirigir a la URL con el nuevo ID
        window.history.replaceState({}, '', `/templates/visual-editor?id=${newTemplate.id}`);
        toast.success('Template created successfully');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      <TemplatePalette />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none focus:outline-none"
              placeholder="Template Title"
              disabled={isLoading}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none mt-1"
              placeholder="Add a description..."
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={saveTemplate} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Save className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      {selectedNode && (
        <PropertiesPanel
          selectedNode={selectedNode}
          onClose={onPanelClose}
          onUpdate={onNodeUpdate}
        />
      )}
    </div>
  );
};

// Wrapper component that uses Suspense
const TemplateCanvas = () => {
  return <TemplateCanvasContent />;
};

export default TemplateCanvas;