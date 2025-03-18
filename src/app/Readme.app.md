# App Directory Documentation

## Introduction

The `app` directory implements Next.js App Router architecture, representing the main page structure and routing system for Doc-Muse. This directory contains all routes, layouts, and page components organized in a hierarchical folder structure.

## Directory Structure

```
app/
├── api/                 # API endpoints using Route Handlers
│   ├── tables/          # Table schema endpoints
│   └── templates/       # Template management endpoints
├── block-editor/        # Block editor interface
├── chat/                # Chat functionality (in development)
├── dashboard/           # Dashboard with statistics
├── document-templates/  # Document templates (redirects to /templates)
├── documents/           # Document management
├── project-templates/   # Project templates (redirects to /templates?tab=projects)
├── projects/            # Project management
├── templates/           # Template management with visual editor
├── error.tsx            # Error boundary component
├── health.ts            # Health check endpoint
├── layout.tsx           # Root layout component
├── not-found.tsx        # 404 page component
└── page.tsx             # Application home page
```

## Core Components

### Root Layout (`layout.tsx`)
The root layout defines the common structure wrapped around all pages, including navigation, authentication state, and global providers.

### Home Page (`page.tsx`)
The home page (`page.tsx`) serves as the entry point, rendering:
- Authentication form for unauthenticated users
- Project listing for authenticated users
- Project creation and editing functionality

### Error Handling
- `error.tsx`: Global error boundary that catches and displays errors gracefully
- `not-found.tsx`: Custom 404 page displayed when a route doesn't exist

## Key Routes

### `/projects`
Project management interface allowing users to:
- View all projects (`/projects/page.tsx`)
- Create new projects (`/projects/new/page.tsx`)
- Edit existing projects (`/projects/[id]/page.tsx`)

```tsx
// Example: Navigating to projects
import { useRouter } from "next/navigation"

const router = useRouter()
router.push("/projects") // Navigate to projects list
router.push("/projects/new") // Create new project
router.push(`/projects/${projectId}`) // Edit specific project
```

### `/documents`
Document management interface with:
- Document listings
- Document editing interface
- Document viewing interface

```tsx
// Example: Rendering document editor
<DocumentEditor
  projectId={document.project_id}
  documentId={document.id}
  initialContent={document.content || ""}
  onSave={() => toast.success("Document saved")}
/>
```

### `/templates`
Template management system with:
- Document templates
- Project templates
- Visual editor (`/templates/visual-editor`)
- Block editor (`/templates/editor/[id]`)

```tsx
// Example: Switching between template tabs
const [activeTab, setActiveTab] = useState<"documents" | "projects">(
  tabParam === "projects" ? "projects" : "documents"
)
```

### `/api`
RESTful endpoints for data operations:
- `/api/templates/visual`: Endpoints for managing visual template data
- `/api/templates/[id]`: Operations on specific templates
- `/api/tables/schema`: Database schema information

## Authentication Patterns

Authentication is handled using Supabase throughout the application:

```tsx
// Client-side authentication check
const { session, loading } = useAuth()

if (loading) {
  return <LoadingSpinner />
}

if (!session) {
  router.replace("/")
  return null
}
```

```tsx
// Server-side authentication check (in layout.tsx files)
const supabase = createServerComponentClient({ cookies });
  
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  redirect('/auth/login');
}
```

## Data Fetching Patterns

The application uses Supabase for data fetching with these common patterns:

```tsx
// Fetch data example
const fetchTemplates = async () => {
  try {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    setTemplateData(data || [])
  } catch (error) {
    console.error("Error fetching templates:", error)
    toast.error("Failed to load templates")
  } finally {
    setLoading(false)
  }
}
```

## Visual Editor

The application includes a powerful visual editor for templates using React Flow:

```tsx
// Visual editor implementation
<ReactFlowProvider>
  <TemplateCanvas
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    onSave={handleFlowChange}
  />
  <ValidationPanel 
    visualData={{ nodes, edges }}
  />
</ReactFlowProvider>
```

## Form Patterns

Common form patterns throughout the application:

```tsx
// Form input pattern
<Input
  type="text"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value)
    setHasUnsavedChanges(true)
  }}
  className="text-xl font-semibold"
  placeholder="Template Title"
/>
```

## Best Practices

1. **Route Protection**: Use layout components to protect routes requiring authentication.
2. **Loading States**: Always provide loading indicators during data fetching operations.
3. **Error Handling**: Use try/catch blocks with toast notifications for error feedback.
4. **Navigation**: Use Next.js navigation hooks (`useRouter`) for programmatic navigation.
5. **Unsaved Changes**: Implement confirmation dialogs to prevent data loss when navigating away from forms with unsaved changes.

## Integration with Supabase

The application is tightly integrated with Supabase for:
- Authentication using `useAuth` hook
- Data storage with PostgreSQL
- Real-time updates (where applicable)

```tsx
// Example: Supabase token management
useEffect(() => {
  SupabaseTokenManager.setSession(session);
}, [session]);
```

## Development Guidelines

1. **Routing**: Follow the App Router pattern where each folder represents a route segment.
2. **Page Components**: Create page components for rendering route content.
3. **Layout Components**: Use layout components for shared UI across multiple pages.
4. **Server Components**: Leverage server components for data-intensive operations.
5. **Client Components**: Use "use client" directive for components requiring interactivity.
6. **API Routes**: Implement Route Handlers in the `/api` directory for backend functionality.

## Common Conventions

- Use "use client" directive at the top of client components
- Organize layouts to handle authentication and provide common UI elements
- Keep page components focused on route-specific functionality
- Implement detailed error handling with user-friendly messages

This documentation provides an overview of the application's structure and key patterns. For detailed information about specific components, refer to the respective documentation files in each directory.
