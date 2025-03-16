// ...existing code...
interface TemplateOperations {
  addNode: (node: TemplateNodeData) => void;
  removeNode: (id: string) => void;
  // ...other operations...
}

const useTemplateOperations = (): TemplateOperations => {
  // ...existing code...
};
