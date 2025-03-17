"use client";
import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { saveTemplate, loadTemplate, mapTemplateToTable } from '../../api/templateApi';
import { supabase } from '../../lib/supabase';
import '../templates/editor/components/BlockEditorPage.css';
import { CorrectTrigger as SelectTrigger, CorrectValue as SelectValue, CorrectContent as SelectContent, CorrectItem as SelectItem } from './ui/select';

// Importar componentes que dependen del DOM de manera dinámica con SSR desactivado
const ReactFlowProvider = dynamic(
  () => import('@xyflow/react').then(mod => mod.ReactFlowProvider),
  { ssr: false }
);

const Palette = dynamic(
  () => import('../../components/Palette'),
  { ssr: false }
);

import Canvas from '../../components/Canvas';

const PropertiesPanel = dynamic(
  () => import('../../components/PropertiesPanel'),
  { ssr: false }
);

const FieldMappingPanel = dynamic(
  () => import('../../components/FieldMappingPanel'),
  { ssr: false }
);

interface Props {
  className?: string;
  testProp?: string;
  id?: string;
}

interface FlowData {
  nodes: any[];
  edges: any[];
}

export default function BlockEditorPage(props: Props) {
  const [flowData, setFlowData] = useState<FlowData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInitialData = async () => {
      if (props.id) {
        try {
          const templateData = await loadTemplate(props.id);
          if (templateData) {
            setFlowData(templateData);
          }
        } catch (error) {
          console.error('Error loading template:', error);
        }
      }
    };
    loadInitialData();
  }, [props.id]);

  const handleNodeSelect = useCallback((node: any) => {
    setSelectedNode(node);
  }, []);

  const handleFlowChange = useCallback((newFlow: FlowData) => {
    setFlowData(newFlow);
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setFlowData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    }));
  }, []);

  const handleMappingChange = useCallback((mappings: Record<string, string>) => {
    setFieldMappings(mappings);
  }, []);

  return (
    <div className={props.className || "default-class"}>
      <ReactFlowProvider>
        <Palette />
        <Canvas initialData={flowData} onNodeSelect={handleNodeSelect} onFlowChange={handleFlowChange} />
        {selectedNode && (
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onUpdateNode={handleUpdateNode} 
          />
        )}
        {showFieldMapping && selectedTable && (
          <FieldMappingPanel
            nodes={flowData.nodes}
            tableColumns={tableColumns}
            initialMappings={fieldMappings}
            onMappingChange={handleMappingChange}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
}