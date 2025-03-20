import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { getDependencyStyle } from '@/lib/utils/edge-styles';

const dependencyLabels = {
  depends: 'Depends on',
  references: 'References',
  triggers: 'Triggers',
  optional: 'Optional'
};

export function TemplateEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dependencyType = data?.dependencyType || 'depends';
  const edgeStyle = getDependencyStyle(dependencyType);

  return (
    <TooltipProvider>
      <g>
        <Tooltip>
          <TooltipTrigger asChild>
            <path
              id={id}
              className={`react-flow__edge-path ${selected ? 'selected' : ''}`}
              d={edgePath}
              style={{
                ...style,
                ...edgeStyle,
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              markerEnd={markerEnd}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Click to change dependency type</p>
          </TooltipContent>
        </Tooltip>

        <foreignObject
          width={100}
          height={40}
          x={labelX - 50}
          y={labelY - 20}
          className="overflow-visible"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center justify-center">
            <Badge 
              variant="outline" 
              className={`
                text-xs whitespace-nowrap px-2 py-0.5
                ${selected ? 'bg-white shadow-sm' : 'bg-white/80'} 
                ${dependencyType === 'depends' ? 'border-blue-500 text-blue-600' : ''}
                ${dependencyType === 'references' ? 'border-green-500 text-green-600' : ''}
                ${dependencyType === 'triggers' ? 'border-amber-500 text-amber-600' : ''}
                ${dependencyType === 'optional' ? 'border-slate-400 text-slate-500' : ''}
              `}
            >
              {dependencyLabels[dependencyType as keyof typeof dependencyLabels]}
            </Badge>
          </div>
        </foreignObject>
      </g>
    </TooltipProvider>
  );
}