import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { TemplateNodeData } from '@/components/templates/TemplateNode';
import { toast } from 'react-hot-toast';

interface PropertiesPanelProps {
  node: Node<TemplateNodeData>;
  updateNode: (data: Partial<TemplateNodeData>) => void;
  onClose: () => void;
}

export const PropertiesPanel = ({ node, updateNode, onClose }: PropertiesPanelProps) => {
  const [name, setName] = useState(node.data.name || '');
  const [description, setDescription] = useState(node.data.description || '');
  const [aiPrompt, setAiPrompt] = useState(node.data.aiPrompt || '');
  const [isRequired, setIsRequired] = useState(node.data.isRequired || false);

  useEffect(() => {
    setName(node.data.name || '');
    setDescription(node.data.description || '');
    setAiPrompt(node.data.aiPrompt || '');
    setIsRequired(node.data.isRequired || false);
  }, [node]);

  const handleSave = () => {
    try {
      updateNode({
        name,
        description,
        aiPrompt,
        isRequired,
      });
      toast.success('Node updated successfully');
    } catch (error: any) {
      toast.error(`Error updating node: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Edit Properties</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700">AI Prompt</label>
          <textarea
            id="aiPrompt"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="isRequired" className="inline-flex items-center">
            <input
              type="checkbox"
              id="isRequired"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Required</span>
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
