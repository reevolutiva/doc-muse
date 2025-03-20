import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TemplateNodeData } from './TemplateNode';

interface SideBarProps {
  onAddNode: (nodeData: TemplateNodeData) => void;
}

export const SideBar = ({ onAddNode }: SideBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAddNode = () => {
    try {
      if (!name) {
        toast.error('Name is required');
        return;
      }

      const newNodeData: TemplateNodeData = {
        id: `node-${Date.now()}`,
        name,
        description,
        aiPrompt,
      };

      onAddNode(newNodeData);

      setName('');
      setDescription('');
      setAiPrompt('');
      setIsOpen(false);
      toast.success('Node added successfully');
    } catch (error: any) {
      toast.error(`Error adding node: ${error.message}`);
    }
  };

  return (
    <div className="w-full">
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsOpen(true)}
      >
        Add New Template
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-md p-4 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Template</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

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
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleAddNode}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
