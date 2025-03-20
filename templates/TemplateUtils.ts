// Converted from TemplateUtils.js

import { Template } from '../types/Template';
import { User } from '../types/User';

interface TemplateVariable {
  name: string;
  value: string;
}

interface ProcessTemplateOptions {
  template: Template;
  user?: User;
  variables?: TemplateVariable[];
}

export const processTemplate = ({ 
  template, 
  user, 
  variables = [] 
}: ProcessTemplateOptions): string => {
  let content = template.content;
  
  // Replace built-in variables
  content = content.replace(/{{projectName}}/g, template.projectName || '');
  content = content.replace(/{{date}}/g, new Date().toLocaleDateString());
  
  // Replace user variables if user is provided
  if (user) {
    content = content.replace(/{{userName}}/g, user.displayName || '');
    content = content.replace(/{{userEmail}}/g, user.email || '');
    content = content.replace(/{{company}}/g, user.company || '');
  }
  
  // Replace custom variables
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g');
    content = content.replace(regex, variable.value);
  });
  
  return content;
};

export const getDefaultVariables = (template: Template): TemplateVariable[] => {
  const variableRegex = /{{([^}]+)}}/g;
  const content = template.content;
  const matches = [...content.matchAll(variableRegex)];
  
  return matches.map(match => ({
    name: match[1],
    value: ''
  }));
};

export const isTemplateCompatible = (template: Template, projectType: string): boolean => {
  if (!template.compatibility || template.compatibility.length === 0) {
    return true; // Compatible with all if not specified
  }
  
  return template.compatibility.includes(projectType);
};
