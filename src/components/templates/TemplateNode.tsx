// ...existing code...
interface TemplateNodeData {
  id: string;
  type: string;
  // ...other properties...
}

interface TemplateNodeProps {
  data: TemplateNodeData;
  // ...other props...
}

const TemplateNode: React.FC<TemplateNodeProps> = ({ data }) => {
  // ...existing code...
};
