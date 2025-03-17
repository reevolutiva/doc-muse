# Unified Templates Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Project Templates](#project-templates)
3. [Document Templates](#document-templates)
4. [Template Creation](#template-creation)
5. [Development Roadmap](#development-roadmap)
6. [Best Practices](#best-practices)
7. [API Reference](#api-reference)
8. [Template Variables](#template-variables)
9. [Troubleshooting](#troubleshooting)

## Introduction
This document consolidates information from the previous `rfp_templates.md` and `roadmap_templates.md` files to provide a comprehensive guide to all template functionality in the Doc-Muse system.

## Project Templates
Project templates define the structure and organization of document collections.

### Available Project Templates
- **Standard Project**: Basic document organization with minimal metadata
- **Research Project**: Extended metadata for academic citations and research methodologies
- **Business Project**: Templates for business documents including proposals and reports
- **Personal Project**: Simple structure for personal documents and notes

### Template Structure
Each project template includes:
- Default document structure
- Metadata schema
- Access control settings
- Integration configurations

## Document Templates
Document templates provide pre-defined content structure for individual documents.

### Available Document Templates
- **Blank Document**: Empty document with basic formatting
- **Report**: Structured report with title, summary, sections, and conclusions
- **Proposal**: Project proposal template with objectives, scope, and timeline
- **Meeting Notes**: Template for recording meeting discussions and action items
- **Research Paper**: Academic research template with citations and references
- **Resume/CV**: Professional resume with sections for experience and skills

### Document Sections
Templates can define standard sections with placeholders for:
- Executive summaries
- Objectives
- Methodologies
- Findings
- Conclusions
- References

## Template Creation
Create custom templates to standardize documents across your organization.

### Project Template Creation
1. Navigate to Templates > Create New > Project Template
2. Define metadata fields and structure
3. Set default document templates
4. Configure access permissions
5. Save and publish

### Document Template Creation
1. Navigate to Templates > Create New > Document Template
2. Use the visual editor to create template structure
3. Add variables using the {{variable}} syntax
4. Set default content and placeholder text
5. Save and categorize your template

### Template Validation
All templates undergo automatic validation to ensure:
- Valid HTML structure
- Proper variable syntax
- Compatible metadata fields
- Responsive layout

## Development Roadmap

### Q3 2023
- Template versioning system
- Template categories and tagging
- Improved template search
- Template sharing between organizations

### Q4 2023
- Collaborative template editing
- Template approval workflows
- Template analytics
- AI-powered template suggestions

### Q1 2024
- AI-assisted template generation
- Template marketplace
- Template localization and internationalization
- Advanced template customization options

### Q2 2024
- Template integration with external data sources
- Interactive template elements
- Template performance analytics
- Mobile template creation

## Best Practices
- Keep templates modular for maximum reusability
- Use consistent naming conventions
- Document template purpose and usage instructions
- Test templates across different document sizes and content types
- Limit the number of required fields
- Provide clear instructions for template users
- Regularly update templates based on user feedback
- Use version control for template management

## API Reference
The Template API allows programmatic access to templates.

### Authentication
API requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_api_token>
```

### Endpoints
- `GET /api/templates`: List all available templates
- `GET /api/templates/:id`: Get a specific template by ID
- `POST /api/templates`: Create a new template
- `PUT /api/templates/:id`: Update an existing template
- `DELETE /api/templates/:id`: Delete a template
- `GET /api/templates/search`: Search templates by criteria
- `POST /api/templates/:id/duplicate`: Create a copy of a template

### Template Object Schema
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'document';
  content: object;
  metadata: {
    creator: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
  }
}
```

## Template Variables
Templates support dynamic content through variables:
- `{{projectName}}`: Inserts the current project name
- `{{userName}}`: Inserts the current user's name
- `{{date}}`: Inserts the current date
- `{{company}}`: Inserts the company name from user profile
- `{{department}}`: Inserts the user's department
- `{{currentYear}}`: Inserts the current year

### Custom Variables
Create custom variables by adding fields to your user profile or project metadata.

### Variable Formatting
Format variables using modifiers:
- `{{date:DD-MM-YYYY}}`: Format dates
- `{{number:2}}`: Format numbers with decimal places
- `{{text:uppercase}}`: Format text in uppercase

## Troubleshooting

### Common Template Issues
- **Missing Variables**: Check that all required variables are defined
- **Formatting Problems**: Verify template HTML structure
- **Permission Errors**: Confirm user has appropriate access level
- **Rendering Issues**: Check browser compatibility

### Support Resources
- Documentation: [docs.docmuse.com](https://docs.docmuse.com)
- Community Forum: [community.docmuse.com](https://community.docmuse.com)
- Contact Support: [support@docmuse.com](mailto:support@docmuse.com)
