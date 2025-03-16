import { Handle, Position } from '@xyflow/react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit, Trash, Copy, FileText, Folder } from 'lucide-react';

interface TemplateNodeProps {
  data: {
    label: string;
    type: 'document' | 'project';
    description?: string;
    isRequired?: boolean;
  };
  selected: boolean;
}

const TemplateNode = ({ data, selected }: TemplateNodeProps) => {
  return (
    <Card className={`w-[250px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center gap-2 p-3">
        {data.type === 'document' ? (
          <FileText className="h-4 w-4" />
        ) : (
          <Folder className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">{data.label}</span>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      {data.description && (
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
          {data.description}
        </CardContent>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default TemplateNode;