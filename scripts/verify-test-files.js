const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/components/TemplateNode.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/breadcrumbs.tsx',
  'src/components/ui/form.tsx',
  'src/components/Sidebar.tsx',
  'src/components/DocumentList.tsx',
  'src/contexts/TemplateContext.tsx',
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));

if (missingFiles.length > 0) {
  console.error('⚠️ Archivos faltantes:');
  missingFiles.forEach(file => console.error(`  - ${file}`));
  process.exit(1);
}

console.log('✅ Todos los archivos necesarios existen');