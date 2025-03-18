import React from 'react';
import { Handle, Position } from 'reactflow';

interface TemplateNodeProps {
  id?: string;
  data?: {
    id?: string;
    label?: string;
    type?: string;
    properties?: any;
  };
  title?: string;
  description?: string;
  className?: string;
  onConnect?: () => void;
}

export const TemplateNode: React.FC<TemplateNodeProps> = ({ 
  id, 
  data, 
  title, 
  description, 
  className = '',
  onConnect
}) => {
  // Usar los datos pasados directamente o desde el objeto data
  const nodeTitle = title || (data?.label || 'Nodo');
  const nodeType = data?.type || 'document';
  
  return (
    <div className={`template-node ${className}`} data-testid="template-node">
      <Handle
        id="target"
        type="target"
        position={Position.Top}
        data-testid="handle-target"
      />
      <div className="template-node-content">
        <div className="template-node-title">{nodeTitle}</div>
        {description && <div className="template-node-description">{description}</div>}
        <div className="template-node-type">{nodeType}</div>
      </div>
      <Handle
        id="source"
        type="source"
        position={Position.Bottom}
        data-testid="handle-source"
      />
    </div>
  );
}
