import fs from 'fs';
import path from 'path';

const roadmapPath = path.join(process.cwd(), 'Docs/testing/testing_roadmap.md');
const currentDate = new Date().toISOString().split('T')[0];

try {
  let content = fs.readFileSync(roadmapPath, 'utf-8');
  content = content.replace(/\[CURRENT_DATE\]/g, currentDate);

  fs.writeFileSync(roadmapPath, content);
  console.log(`Fecha actualizada en el roadmap a: ${currentDate}`);
} catch (error) {
  console.error('Error al actualizar la fecha en el roadmap:', error);
}
