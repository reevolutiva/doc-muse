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
// Asegurarse de que las propiedades importadas de Canvas sean correctas

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
}

export default function BlockEditorPage(props: Props) {
  console.log("BlockEditorPage props:", props);
  console.log("BlockEditorPage className:", props.className);
  console.log("BlockEditorPage testProp:", props.testProp);

  const templateId = props.id;
  // ...resto del código existente del componente...
  return (
    <div className={props.className || "default-class"}>
      <ReactFlowProvider>
        <Palette />
        <Canvas initialData={flowData} onNodeSelect={handleNodeSelect} onFlowChange={handleFlowChange} />
        <PropertiesPanel selectedNode={selectedNode} onUpdateNode={handleUpdateNode} />
        {showFieldMapping && selectedTable && (
          <FieldMappingPanel
            nodes={flowData.nodes}
            tableColumns={tableColumns}
            initialMappings={fieldMappings}
            onMappingChange={handleMappingChange}
          />
        )}
      </ReactFlowProvider>
      <div className={myData?.className}>...</div>
    </div>
  );
}