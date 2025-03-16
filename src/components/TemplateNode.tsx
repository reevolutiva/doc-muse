"use client"

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Folder, Edit, Trash, Copy } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { TemplateNodeProps } from '../lib/types/templates/ui';

const TemplateNode: React.FC<TemplateNodeProps> = memo(({ data, selected, id, onEdit, onDuplicate, onDelete }) => {
  return (
    <TooltipProvider>
      <Card 
        className={`w-[250px] ${selected ? 'border-primary shadow-lg' : 'shadow-sm'} transition-all`}
        data-testid="template-node"
      >
        <Handle 
          type="target" 
          position={Position.Top}
          className="!bg-gray-400 hover:!bg-blue-500 transition-colors"
        />

        <CardHeader className="flex flex-row items-center gap-2 p-3">
          {data.type === 'document' ? (
            <FileText className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
          <span className="text-sm font-medium flex-1">{data.label}</span>
          
          <div className="flex gap-1">
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(data);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit template</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {onDuplicate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(data);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate template</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete template</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>

        {data.description && (
          <CardContent className="p-3 pt-0 text-sm text-muted-foreground">
            {data.description}
          </CardContent>
        )}
        
        {data.isRequired && (
          <div className="px-3 pb-3">
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
              Required
            </span>
          </div>
        )}
        
        {data.prompt && (
          <div className="px-3 pb-3 text-xs text-muted-foreground">
            <strong>AI Prompt:</strong> {data.prompt}
          </div>
        )}

        <Handle 
          type="source" 
          position={Position.Bottom}
          className="!bg-gray-400 hover:!bg-blue-500 transition-colors"
        />
      </Card>
    </TooltipProvider>
  );
});

TemplateNode.displayName = 'TemplateNode';

export default TemplateNode;