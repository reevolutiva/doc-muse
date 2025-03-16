// Canvas.js - Editor visual con React Flow (xyflow)
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ReactFlowProvider, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './Canvas.css';

// Importamos los bloques definidos en la paleta
import { blocks } from './Palette';

// Componente personalizado para los nodos
import TemplateNode from './TemplateNode';

// Función para generar un ID único
const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

function Canvas({ initialData = { nodes: [], edges: [] }, onNodeSelect, onFlowChange }) {
  // Referencia al elemento DOM del canvas para calcular posición de nuevos nodos
  const reactFlowWrapper = useRef(null);
  
  // Estado para los nodos y conexiones
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
  
  // Estado para almacenar la instancia de React Flow
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Tipos de nodos personalizados
  const nodeTypes = {
    templateNode: TemplateNode
  };

  // Cargar datos iniciales cuando cambian
  useEffect(() => {
    if (initialData && initialData.nodes && initialData.edges) {
      setNodes(initialData.nodes);
      setEdges(initialData.edges);
    }
  }, [initialData, setNodes, setEdges]);

  // Notificar cambios en el flujo hacia arriba
  useEffect(() => {
    if (onFlowChange && nodes.length >= 0) {
      onFlowChange(nodes, edges);
    }
  }, [nodes, edges, onFlowChange]);

  // Manejar la creación de nuevas conexiones
  const onConnect = useCallback(
    (params) => {
      // Validar la conexión antes de crearla
      // Por ejemplo, evitar que un nodo se conecte a sí mismo
      if (params.source === params.target) {
        return;
      }
      
      setEdges((eds) => addEdge(
        { 
          ...params, 
          animated: true, 
          style: { stroke: '#0066cc' },
          type: 'smoothstep',
          // Añadir metadatos a la conexión para mostrar relación
          data: { relationship: 'depends_on' }
        }, 
        eds
      ));
    },
    [setEdges]
  );

  // Manejar el evento de soltar un elemento en el canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      // Obtener la posición relativa al canvas donde se suelta
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      try {
        // Extraer datos del bloque arrastrado
        const blockData = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        );

        // Crear un nuevo nodo basado en el bloque
        const newNode = {
          id: getId(),
          type: 'templateNode',
          position,
          data: { 
            ...blockData,
            label: blockData.name,
            props: { ...blockData.defaultProps }
          },
        };

        // Añadir el nuevo nodo al canvas
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error al procesar el bloque arrastrado:', error);
      }
    },
    [reactFlowInstance, setNodes]
  );

  // Configurar el evento de arrastrar sobre el canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Manejar la selección de un nodo
  const onNodeClick = useCallback((event, node) => {
    if (typeof onNodeSelect === 'function') {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  // Manejar la eliminación de nodos o conexiones
  const onKeyDown = useCallback(
    (event) => {
      // Permitir eliminar nodos o conexiones con Delete o Backspace
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div 
      className="canvas-container" 
      ref={reactFlowWrapper} 
      tabIndex={0} 
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'header': return '#4285f4';
              case 'paragraph': return '#34a853';
              case 'image': return '#ea4335';
              case 'list': return '#fbbc05';
              case 'table': return '#9c27b0';
              case 'form-field': return '#ff6d01';
              default: return '#aaa';
            }
          }}
          maskColor="rgba(240, 240, 240, 0.6)"
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      
      {/* Instrucciones de ayuda en el canvas */}
      <div className="canvas-help">
        <div className="canvas-help-tooltip">
          <strong>Consejos:</strong>
          <ul>
            <li>Arrastra bloques desde la paleta izquierda</li>
            <li>Conecta los nodos desde los puntos de conexión</li>
            <li>Selecciona un nodo para editar sus propiedades</li>
            <li>Presiona Delete para eliminar elementos seleccionados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Exportar como componente nombrado para poder ser importado con { Canvas }
export { Canvas };

// Mantener el default export para compatibilidad con código existente
export default Canvas;
