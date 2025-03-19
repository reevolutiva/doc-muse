import { useState, useEffect } from 'react';
import { TemplateNodeData } from './TemplateNode';
import { Node } from '@xyflow/react';
import { Action } from '@radix-ui/react-alert-dialog';

interface SideBarProps {
  onAddNode: (nodeData: TemplateNodeData) => void;
  nodeToEdit?: Node<TemplateNodeData> | null;
  setNodeToEdit?: React.Dispatch<React.SetStateAction<Node<TemplateNodeData> | null>>;
}

export const SideBar = ({ onAddNode, nodeToEdit, setNodeToEdit }: SideBarProps) => {
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const isEditMode = !!nodeToEdit;

  // Use useEffect to update the form fields when nodeToEdit changes
  useEffect(() => {
    if (nodeToEdit) {
      setNodeName(nodeToEdit.data.name || '');
      setNodeDescription(nodeToEdit.data.description || '');
      setIsRequired(nodeToEdit.data.isRequired || false);
      setAiPrompt(nodeToEdit.data.aiPrompt || '');
    } else {
      // Reset form if no node is selected
      setNodeName('');
      setNodeDescription('');
      setIsRequired(false);
      setAiPrompt('');
    }
  }, [nodeToEdit]);

  const handleAddNode = () => {
    
    if (!nodeName.trim()) return;

    const newNode: TemplateNodeData = {
      name: nodeName,
      description: nodeDescription,
      isRequired,
      aiPrompt: aiPrompt || undefined,
      action: nodeToEdit ? "update" : "add"
    };

    onAddNode(newNode);

    // Reset form
    setNodeName('');
    setNodeDescription('');
    setIsRequired(false);
    setAiPrompt('');
    setNodeToEdit(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{isEditMode ? 'Update Node' : 'Add Node'}</h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Node name"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Description
          <textarea
            value={nodeDescription}
            onChange={(e) => setNodeDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Node description"
            rows={3}
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRequired"
          checked={isRequired}
          onChange={(e) => setIsRequired(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
          Required
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          AI Prompt
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="AI prompt for content generation"
            rows={3}
          />
        </label>
      </div>

      <button
        onClick={handleAddNode}
        disabled={!nodeName.trim()}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
      {isEditMode ? 'Update Node' : 'Add Node'}
      </button>
    </div>
  );
};

export default SideBar;