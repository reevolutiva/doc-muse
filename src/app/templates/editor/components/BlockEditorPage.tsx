"use client";
import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { saveTemplate, loadTemplate, mapTemplateToTable } from '../../../../api/templateApi';
import { supabase } from '../../../../lib/supabase';
import './BlockEditorPage.css';

// Importar componentes que dependen del DOM de manera dinámica con SSR desactivado
const ReactFlowProvider = dynamic(
  () => import('@xyflow/react').then(mod => mod.ReactFlowProvider),
  { ssr: false }
);

const Palette = dynamic(
  () => import('../../../../components/Palette'),
  { ssr: false }
);

const Canvas = dynamic(
  () => import('../../../../components/Canvas'),
  { ssr: false }
);

const PropertiesPanel = dynamic(
  () => import('../../../../components/PropertiesPanel'),
  { ssr: false }
);

const FieldMappingPanel = dynamic(
  () => import('../../../../components/FieldMappingPanel'),
  { ssr: false }
);

interface BlockEditorPageProps {
  templateId?: string;
}

export default function BlockEditorPage({ templateId }: BlockEditorPageProps) {
  // Estados existentes
  const [selectedNode, setSelectedNode] = useState(null);
  const [template, setTemplate] = useState({
    name: 'Nueva plantilla',
    description: '',
    is_required: false
  });
  const [flowData, setFlowData] = useState({
    nodes: [],
    edges: []
  });
  
  // Estados para el mapeo de campos
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState([]);
  const [fieldMappings, setFieldMappings] = useState({});
  
  // Cargar las tablas disponibles en Supabase
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
          
        if (error) throw error;
        
        setTables(data.map(t => t.tablename));
      } catch (error) {
        console.error('Error al cargar tablas:', error);
      }
    };
    
    fetchTables();
  }, []);
  
  // Cargar columnas cuando se selecciona una tabla
  useEffect(() => {
    if (!selectedTable) return;
    
    const fetchColumns = async () => {
      try {
        const { data, error } = await supabase
          .from('pg_columns')
          .select('column_name, data_type')
          .eq('table_name', selectedTable);
          
        if (error) throw error;
        
        setTableColumns(data.map(col => ({
          name: col.column_name,
          type: col.data_type
        })));
      } catch (error) {
        console.error('Error al cargar columnas:', error);
      }
    };
    
    fetchColumns();
  }, [selectedTable]);

  // Cargar datos de plantilla existente
  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        try {
          const data = await loadTemplate(templateId);
          
          setTemplate({
            id: data.id,
            name: data.name,
            description: data.description,
            is_required: data.is_required || false
          });
          
          if (data.visual_data) {
            const visualData = data.visual_data;
            if (visualData.nodes && visualData.edges) {
              setFlowData({
                nodes: visualData.nodes,
                edges: visualData.edges
              });
            }
          }
          
          // Cargar mappings existentes
          if (data.table_mappings) {
            setSelectedTable(data.table_mappings.table_name);
            setFieldMappings(data.table_mappings.field_mappings);
          }
        } catch (error) {
          console.error('Error al cargar la plantilla:', error);
        }
      };
      
      fetchTemplate();
    }
  }, [templateId]);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);
  
  const handleUpdateNode = useCallback((nodeId, newData) => {
    setFlowData(prev => {
      const nodes = prev.nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      });
      
      return { ...prev, nodes };
    });
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({ ...prev, data: newData }));
    }
  }, [selectedNode]);
  
  const handleFlowChange = useCallback((nodes, edges) => {
    setFlowData({ nodes, edges });
  }, []);

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    setFieldMappings({});
  };
  
  const handleMappingChange = async (newMappings) => {
    setFieldMappings(newMappings);
    
    if (template.id && selectedTable) {
      try {
        await mapTemplateToTable(template.id, selectedTable, newMappings);
      } catch (error) {
        console.error('Error al guardar el mapeo:', error);
      }
    }
  };
  
  const handleSaveTemplate = async () => {
    try {
      const templateData = {
        ...template,
        visual_data: flowData,
        table_mappings: selectedTable ? {
          table_name: selectedTable,
          field_mappings: fieldMappings
        } : null
      };
      
      const result = await saveTemplate(templateData);
      
      setTemplate(prev => ({
        ...prev,
        id: result.id
      }));
      
      alert('¡Plantilla guardada con éxito!');
    } catch (error) {
      console.error('Error al guardar la plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };
  
  const handleTemplateChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="block-editor-page">
      <header className="editor-header">
        <div className="template-info">
          <input
            type="text"
            className="template-name-input"
            value={template.name}
            onChange={(e) => handleTemplateChange('name', e.target.value)}
            placeholder="Nombre de la plantilla"
          />
          <input
            type="text"
            className="template-description-input"
            value={template.description}
            onChange={(e) => handleTemplateChange('description', e.target.value)}
            placeholder="Descripción (opcional)"
          />
          <label className="required-checkbox">
            <input
              type="checkbox"
              checked={template.is_required}
              onChange={(e) => handleTemplateChange('is_required', e.target.checked)}
            />
            Requerido
          </label>
        </div>
        
        <div className="editor-actions">
          <select
            className="table-select"
            value={selectedTable}
            onChange={(e) => handleTableSelect(e.target.value)}
          >
            <option value="">Seleccionar tabla...</option>
            {tables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
          
          <button 
            className="mapping-button"
            onClick={() => setShowFieldMapping(!showFieldMapping)}
            disabled={!selectedTable}
          >
            {showFieldMapping ? 'Ocultar mapeo' : 'Mapear campos'}
          </button>
          
          <button className="save-button" onClick={handleSaveTemplate}>
            Guardar plantilla
          </button>
        </div>
      </header>
      
      <div className="editor-container">
        <ReactFlowProvider>
          <Palette />
          <Canvas 
            initialData={flowData} 
            onNodeSelect={handleNodeSelect} 
            onFlowChange={handleFlowChange}
          />
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onUpdateNode={handleUpdateNode} 
          />
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
    </div>
  );
}