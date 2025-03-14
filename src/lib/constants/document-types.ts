import { 
  FileText, Share2, BookOpen, GraduationCap, Route, Layout, 
  Book, ClipboardList, Lightbulb, Presentation, BarChart, 
  ClipboardCheck, Video 
} from "lucide-react"
import type { DocumentTemplate } from "@/lib/types/document"

/**
 * Tipos de documentos disponibles en la aplicación
 */
export const DOCUMENT_TYPES: DocumentTemplate[] = [
  {
    id: 'blog',
    title: 'Publicación para Blog',
    description: 'Genera contenido en formato de artículo para blogs corporativos o personales',
    icon: FileText,
    available: true
  },
  {
    id: 'social',
    title: 'Publicación para Redes Sociales',
    description: 'Crea posts breves o hilos para plataformas como Twitter, LinkedIn, Instagram',
    icon: Share2,
    available: true
  },
  {
    id: 'research',
    title: 'Documento de Investigación',
    description: 'Elabora documentos de análisis o reportes en profundidad',
    icon: BookOpen,
    available: true
  },
  {
    id: 'training',
    title: 'Plan de Formación',
    description: 'Diseña un plan formativo con objetivos, competencias y contenidos',
    icon: GraduationCap,
    available: true
  },
  {
    id: 'learning-path',
    title: 'Ruta de Aprendizaje',
    description: 'Estructura una secuencia de recursos y actividades formativas',
    icon: Route,
    available: true
  },
  {
    id: 'instructional',
    title: 'Proyecto Instruccional',
    description: 'Diseña, Planifica e implementa tu plan de formación',
    icon: Layout,
    available: true
  },
  {
    id: 'course-input',
    title: 'Insumo Base para Curso',
    description: 'Crea recursos iniciales (textos, presentaciones, lecturas)',
    icon: Book,
    available: true
  },
  {
    id: 'quiz',
    title: 'Evaluaciones o Quizzes',
    description: 'Genera cuestionarios, pruebas o ejercicios para medir el progreso',
    icon: ClipboardList,
    available: true
  },
  {
    id: 'case-study',
    title: 'Caso de Estudio',
    description: 'Desarrolla escenarios reales o ficticios que permitan analizar y resolver',
    icon: Lightbulb,
    available: false
  },
  {
    id: 'interactive',
    title: 'Presentaciones Interactivas',
    description: 'Crea diapositivas con elementos interactivos, ideales para exponer',
    icon: Presentation,
    available: false
  },
  {
    id: 'infographic',
    title: 'Infografías',
    description: 'Sintetiza datos e información en formatos visuales claros y atractivos',
    icon: BarChart,
    available: true
  },
  {
    id: 'checklist',
    title: 'Checklists o Fichas Didácticas',
    description: 'Listados de pasos o fichas breves para guiar procesos',
    icon: ClipboardCheck,
    available: false
  },
  {
    id: 'guide',
    title: 'Guías o Manuales Rápidos',
    description: 'Documentos concisos para que el usuario domine rápidamente una',
    icon: Book,
    available: false
  },
  {
    id: 'video-script',
    title: 'Video Scripts o Podcast Scripts',
    description: 'Genera guiones para la creación de contenido audiovisual o de audio',
    icon: Video,
    available: false
  }
]