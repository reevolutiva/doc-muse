import { useState, useEffect } from 'react';
import { TemplateNodeData } from './TemplateNode';
import { Node } from '@xyflow/react';
import { Action } from '@radix-ui/react-alert-dialog';
import ProjectFields from './ProjectsFields';
import DocumentsFields from './DocumentsFields';

interface SideBarProps {
  onAddNode: (nodeData: TemplateNodeData) => void;
  nodeToEdit?: Node<TemplateNodeData> | null;
  setNodeToEdit?: React.Dispatch<React.SetStateAction<Node<TemplateNodeData> | null>>;
  type?: string;
}

export const SideBar = ({ onAddNode, nodeToEdit, setNodeToEdit, type }: SideBarProps) => {
  const [nodeName, setNodeName] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const isEditMode = !!nodeToEdit;
  const entity = type === 'document' ? 'section' : 'document'; 

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

      <h3 className="text-lg font-semibold">{isEditMode ?  `Update ${entity}` : `Add ${entity}` }</h3>


      { type === 'project' && 
      
        <ProjectFields 
          nodeName={nodeName} 
          setNodeName={setNodeName}
          nodeDescription={nodeDescription}
          setNodeDescription={setNodeDescription}
          isRequired={isRequired}
          setIsRequired={setIsRequired}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          entity={entity}
        />
      }

      { type === 'document' && 
      
        <DocumentsFields 
          nodeName={nodeName} 
          entity={entity}
        />
      }
      

      <button
        onClick={handleAddNode}
        disabled={!nodeName.trim()}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
      {isEditMode ? `Update ${entity}` : `Add ${entity}` }
      </button>
    
    </div>
  );
};

export default SideBar;