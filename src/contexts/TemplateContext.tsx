import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Node {
  id: string;
  type: string;
  position: { x: number, y: number };
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface TemplateContextType {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
}

const defaultContextValue: TemplateContextType = {
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
  addNode: () => {},
  addEdge: () => {},
  removeNode: () => {},
  removeEdge: () => {},
};

const TemplateContext = createContext<TemplateContextType>(defaultContextValue);

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const addNode = (node: Node) => {
    setNodes(prev => [...prev, node]);
  };
  
  const addEdge = (edge: Edge) => {
    setEdges(prev => [...prev, edge]);
  };
  
  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  };
  
  const removeEdge = (edgeId: string) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId));
  };
  
  return (
    <TemplateContext.Provider value={{
      nodes,
      edges,
      setNodes,
      setEdges,
      addNode,
      addEdge,
      removeNode,
      removeEdge,
    }}>
      {children}
    </TemplateContext.Provider>
  );
};
