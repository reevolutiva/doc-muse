export  class Node {
  id: string;
  position: { x: number; y: number };
  type: string;
  data: { label: string };
  resizing: boolean
  width: number | null;
  height: number | null;

  constructor(id: string, x: number, y: number, type: string, label: string ) {
    this.id = id;
    this.position = { x: x, y: y };
    this.type = type;
    this.data = { label: label };
    this.resizing = true
    this.width = null;
    this.height = null;
  }

  setResizing( resizing: boolean ){
    this.resizing = resizing
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height
  }
}

export const intialnodes_general_docs = [
  new Node('1', 0, 0, "input", 'Title Document'),
  new Node('2', 0, 100, "deleterNode", 'Introducción'),
  new Node('3', 0, 200, "deleterNode", 'Desarrollo'),
  new Node('4', 0, 300, "deleterNode", 'Conclusión')
];
