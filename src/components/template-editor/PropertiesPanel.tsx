import { useState } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { TemplateNodeData } from './TemplateNode';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
  node: Node<TemplateNodeData>;
  updateNode: (updatedData: Partial<TemplateNodeData>) => void;
  onClose: () => void;
}

export const PropertiesPanel = ({ node, updateNode, onClose }: PropertiesPanelProps) => {
  const [name, setName] = useState(node.data.name || '');
  const [description, setDescription] = useState(node.data.description || '');
  const [isRequired, setIsRequired] = useState(node.data.isRequired || false);
  const [aiPrompt, setAiPrompt] = useState(node.data.aiPrompt || '');

  const handleApplyChanges = () => {
    updateNode({
      name,
      description,
      isRequired,
      aiPrompt: aiPrompt || undefined
    });
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold">Edit Node</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Node name"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Node description"
            rows={3}
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="edit-isRequired"
          checked={isRequired}
          onChange={(e) => setIsRequired(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="edit-isRequired" className="text-sm font-medium text-gray-700">
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

      <div className="flex justify-end gap-2 pt-3">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleApplyChanges}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;