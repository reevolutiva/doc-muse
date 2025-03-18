import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

interface TemplateNodeProps {
  id?: string;
  data?: {
    title?: string;
    type?: string;
    description?: string;
  };
  title?: string;
  description?: string;
  className?: string;
}

export const TemplateNode: React.FC<TemplateNodeProps> = ({
  id,
  data,
  title,
  description,
  className,
}) => {
  const nodeTitle = title || data?.title || 'Node';
  const nodeType = data?.type || 'default';
  const nodeDescription = description || data?.description;

  return (
    <div data-testid="template-node" className={cn('node-container', className)}>
      <Handle type="target" position={Position.Top} id="target" />
      <div className="node-header">
        <h3>{nodeTitle}</h3>
        <span>{nodeType}</span>
      </div>
      {nodeDescription && <p className="node-description">{nodeDescription}</p>}
      <Handle type="source" position={Position.Bottom} id="source" />
    </div>
  );
};

export default TemplateNode;
