import type { TemplateNodeData } from './TemplateNode.tsx';
import { UnHandleNodeData } from './UnHandleNode.tsx';
import getUrlParameter from '../aux.ts';
import { Node } from 'reactflow';

interface Props {
  id?: string;
  name?: string;
  content?: string;
}

const useNodeDelete = ( data: Props, blocks: Node<TemplateNodeData | UnHandleNodeData>[], setNodes: React.Dispatch<React.SetStateAction<Node<TemplateNodeData | UnHandleNodeData>[]>>, setEdges: React.Dispatch<React.SetStateAction<any[]>> ) => {
    
                    const { id, name, content } = data;
    
                    const filter_data = id === undefined ? name : id;
                    const filter_key = id === undefined ? "name" : "id";
    
                    const { type } = getUrlParameter();
    
                    const updatedNodes = blocks.filter((n: Node<TemplateNodeData | UnHandleNodeData> ) => {
                      
    
                      if( type === "project" ){
                        if( filter_key === "name" ){
                          return n.data.name !== filter_data ;
                        }
      
                        if( filter_key === "id" ){
                          return n.data.id !== filter_data ;
                        }
                      }
    
                      if( type === "document" ){
                          return n.data.content !== content ;
                      }
                      
    
                      return n;
    
                    } );
    
                    console.log("updatedNodes", updatedNodes);
                    
                    setNodes(updatedNodes);
                    setEdges([]);
    
                
}
 
export default useNodeDelete;