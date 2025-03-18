import React,{ useState, useEffect } from 'react';

// New component for creating a new template
const CreateTemplateModal = ({ isOpen, onClose, onCreate }) => {
  
  const [templateName, setTemplateName] = useState('');

  const handleCreate = () => {
    onCreate(templateName);
    setTemplateName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Template</h3>
          <div className="mt-2 px-7 py-3">
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className="items-center px-4 py-3">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
              onClick={handleCreate}
            >
              Create
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CreateTemplateModal;