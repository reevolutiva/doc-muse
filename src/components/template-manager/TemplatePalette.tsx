import { FileText, Folder } from 'lucide-react';
import { Card } from '../ui/card';

const TemplatePalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-background p-4 border-r">
      <h3 className="font-medium mb-4">Elements</h3>
      <div className="space-y-2">
        <Card
          draggable
          onDragStart={(e) => onDragStart(e, 'document')}
          className="p-3 cursor-move flex items-center gap-2 hover:bg-accent"
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm">Document Template</span>
        </Card>
        <Card
          draggable
          onDragStart={(e) => onDragStart(e, 'project')}
          className="p-3 cursor-move flex items-center gap-2 hover:bg-accent"
        >
          <Folder className="h-4 w-4" />
          <span className="text-sm">Project Template</span>
        </Card>
      </div>
    </div>
  );
};

export default TemplatePalette;