import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Edit, Copy, SquareChevronUp, SquareChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Define the type for the node data
export interface UnHandleNodeData {
  id: string;
  name?: string;
  description?: string;
  isRequired?: boolean;
  aiPrompt?: string;
  onEdit?: (data: UnHandleNodeData) => void;
  onDuplicate?: (data: UnHandleNodeData) => void;
  onDelete?: ( data: UnHandleNodeData ) => void;
}

// Define the props for the UnHandleNode component
interface UnHandleNodeProps extends NodeProps {
  data: UnHandleNodeData;
}

export const UnHandleNode = memo(({ data, isConnectable }: UnHandleNodeProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      data.onEdit && data.onEdit(data);
    } catch (error: any) {
      toast.error(`Error editing template: ${error.message}`);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      data.onDuplicate && data.onDuplicate(data);
    } catch (error: any) {
      toast.error(`Error duplicating template: ${error.message}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      data.onDelete && data.onDelete(data);
    } catch (error: any) {
      toast.error(`Error deleting template: ${error.message}`);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-md">

      <SquareChevronUp size={16} />

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{data.section_type || 'Untitled'}</h3>
          <div className="flex gap-1">
            <button 
              className="rounded p-1 hover:bg-gray-100" 
              title="Edit"
              onClick={handleEdit}
            >
              <Edit size={16} />
            </button>
            <button 
              className="rounded p-1 hover:bg-gray-100" 
              title="Duplicate"
              onClick={handleDuplicate}
            >
              <Copy size={16} />
            </button>
            <button 
              className="rounded p-1 hover:bg-red-100 text-red-500" 
              title="Delete"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">{data.content || 'No description'}</p>
        
        {data.isRequired && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            Required
          </span>
        )}
        
        {data.aiPrompt && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-semibold">AI Prompt:</span> {data.aiPrompt.substring(0, 50)}...
          </div>
        )}

        {data.url && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-semibold">URL:</span> {data.url}
          </div>
        )}


      </div>
        <SquareChevronDown size={16} />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

UnHandleNode.displayName = 'UnHandleNode';

export default UnHandleNode;