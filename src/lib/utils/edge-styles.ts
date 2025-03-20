export const getDependencyStyle = (type: string) => {
  switch (type) {
    case 'depends':
      return {
        stroke: '#3b82f6',
        strokeWidth: 2,
        animated: false
      };
    case 'references':
      return {
        stroke: '#10b981',
        strokeWidth: 2,
        strokeDasharray: '5,5',
        animated: false
      };
    case 'triggers':
      return {
        stroke: '#f59e0b',
        strokeWidth: 2,
        animated: true
      };
    case 'optional':
      return {
        stroke: '#94a3b8',
        strokeWidth: 1,
        strokeDasharray: '3,3',
        animated: false
      };
    default:
      return {
        stroke: '#94a3b8',
        strokeWidth: 2,
        animated: false
      };
  }
};