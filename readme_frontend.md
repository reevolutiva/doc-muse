# Frontend Documentation

## Overview
Doc-Muse is a Next.js-based web application for document management and template creation. The frontend is built with modern React patterns, TypeScript, and follows a component-based architecture.

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript
- React
- TailwindCSS
- Radix UI Components
- XY Flow (for visual template editor)
- TipTap (for rich text editing)
- Supabase (for backend and auth)

## Project Structure

The frontend is built using Next.js 13+ with React, TypeScript, and Tailwind CSS. The application follows a modern component-based architecture with a clear separation of concerns.

```
doc-muse/
├── app/                    # Next.js 13+ app directory
│   ├── layout.tsx         # Root layout with shared UI
│   ├── page.tsx          # Homepage
│   ├── templates/        # Template management
│   ├── projects/         # Project management
│   ├── documents/        # Document editor and viewing
│   └── block-editor/     # Block-based content editor
├── components/           # Shared React components
│   ├── block-editor/     # Document block editing
│   ├── document-config/  # Document configuration
│   ├── navigation/       # Navigation components
│   ├── project-edit/     # Project editing UI
│   ├── template-manager/ # Template management components
│   └── ui/              # Base UI components
├── lib/                 # Shared utilities and hooks
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   └── supabase.ts     # Supabase client configuration
├── styles/             # Global styles
└── public/            # Static assets

## Key Technologies

- **Next.js 14**: Framework for React applications with routing and server components
- **React**: Frontend library for building user interfaces
- **TypeScript**: Static typing for better development experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **Supabase**: Backend as a service for database and authentication
- **TipTap**: Rich text editor framework
- **React Flow**: Library for building node-based editors and flows

## Core Features

### Template Management
- Visual template editor built with React Flow
- Dependency visualization and management between template nodes
- Custom node types and edge configurations
- Real-time validation and error checking

### Document Editing
- Rich text editor with AI assistance
- Block-based content structure
- Real-time collaboration support
- Version history tracking

### Project Management
- Project creation and organization
- Document templating system
- Progress tracking
- Project template management

## Component Architecture

### Template System
The template system consists of several interconnected components:

1. **TemplateManager**: Main component for listing and managing templates
2. **TemplateForm**: Form for creating/editing template metadata
3. **VisualEditor**: Node-based editor for defining template structure
4. **BlockEditor**: Component for editing individual content blocks

### Document System
The document editing system includes:

1. **DocumentEditor**: Main editing interface
2. **DocumentConfigPanel**: Configuration panel for document settings
3. **LivePreview**: Real-time preview of document changes

### Project System
Project management components:

1. **ProjectList**: Overview of all projects
2. **ProjectEditForm**: Form for editing project details
3. **ProjectFormSection**: Section for project metadata
4. **CreateSection**: Interface for creating new documents

## State Management

- React's built-in useState and useEffect for local component state
- Custom hooks for shared logic and state management
- Context API for theme and user preferences
- Supabase real-time subscriptions for live updates

## Routing Structure

```
/                       # Home page
/projects              # Project listing
/projects/:id          # Project details and editing
/templates             # Template listing
/templates/editor      # Template visual editor
/documents             # Document listing
/documents/view/:id    # Document viewer/editor
```

## Custom Hooks

- `useTemplateManager`: Manages template CRUD operations
- `useDocumentEditor`: Handles document editing state and operations
- `useProjectState`: Manages project state and operations
- `useTemplateHistory`: Handles undo/redo functionality in template editor

## Styling Approach

- TailwindCSS for utility-first styling
- CSS modules for component-specific styles
- Consistent use of design tokens for colors, spacing, etc.
- Responsive design patterns throughout the application

## Performance Considerations

- Dynamic imports for large components
- Image optimization with Next.js Image component
- Code splitting by route
- Memoization of expensive computations
- Debounced saves and updates

## Development Guidelines

1. Use TypeScript for all new components
2. Follow the component organization pattern
3. Implement error boundaries for robust error handling
4. Write unit tests for critical functionality
5. Use semantic HTML elements
6. Ensure responsive design
7. Follow accessibility best practices

## Environment Setup

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Configure environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

3. Run development server:
```bash
npm run dev
# or
pnpm dev
```

## Key Features

### Template Management
- Visual template editor built with React Flow
- Dependency visualization and management between template nodes
- Custom node types and edge configurations
- Real-time validation and error checking

### Document Editor
- Rich text editing with TipTap
- Block-based content structure
- AI-assisted content generation
- Real-time collaboration support
- Version control and history

### Project Management
- Project creation and organization
- Document templating system
- Progress tracking
- Project template management

## Core Components

### Template Edge (src/components/template-manager/template-edge.tsx)
Handles the visualization and interaction of dependencies between template nodes with:
- Custom edge styling
- Interactive edge labels
- Different dependency types (depends, references, triggers, optional)

### Project Edit Form (src/components/project-edit-form.tsx)
Manages project editing with:
- Project data management
- Document organization
- Template association
- Progress tracking

### Document Editor (src/components/document-editor.tsx)
Rich text editing capabilities including:
- Block-based content management
- AI integration
- Real-time collaboration
- Version control

## State Management

The application uses a combination of:
- React hooks for local state
- Context for shared state
- Supabase for real-time data synchronization

## Key Technologies

- Next.js 13+: React framework