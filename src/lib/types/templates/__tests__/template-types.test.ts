import { describe, it, expect } from '@jest/globals';
import type { 
  Template, 
  TemplateNodeData,
  TemplateBlock,
  TemplateVisualData,
  TemplateValidationResult,
  TemplateServiceResult
} from '../base';

// Esta prueba verifica que los tipos se comporten como se espera
// Las pruebas de tipo son verificadas por TypeScript en tiempo de compilación

describe('Template Types', () => {
  it('should properly validate a Template', () => {
    const template: Template = {
      id: '1',
      title: 'Test Template',
      type: 'document',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: {
        time: Date.now(),
        blocks: [],
        version: '1.0.0'
      }
    };

    expect(template).toBeDefined();
  });

  it('should properly validate a TemplateNodeData with Record<string, unknown>', () => {
    const nodeData: TemplateNodeData = {
      id: '1',
      label: 'Test Node',
      type: 'document',
      isRequired: true,
      validation: {
        minLength: 10,
        maxLength: 100,
        pattern: '^[a-zA-Z]+$',
        message: 'Only letters allowed'
      },
      customField: 'test' // Should work due to Record<string, unknown>
    };

    expect(nodeData).toBeDefined();
    expect(nodeData.customField).toBe('test');
  });

  it('should properly validate a TemplateBlock', () => {
    const block: TemplateBlock = {
      id: '1',
      type: 'section',
      content: 'Test content',
      data: {
        align: 'left'
      },
      meta: {
        description: 'A test block'
      }
    };

    expect(block).toBeDefined();
  });

  it('should properly validate TemplateVisualData with nodes and edges', () => {
    const visualData: TemplateVisualData = {
      nodes: [
        {
          id: '1',
          type: 'document',
          position: { x: 0, y: 0 },
          data: {
            id: '1',
            label: 'Test Node',
            type: 'document'
          }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          data: {
            dependencyType: 'required'
          }
        }
      ]
    };

    expect(visualData).toBeDefined();
    expect(visualData.nodes[0].data.type).toBe('document');
    expect(visualData.edges[0].data?.dependencyType).toBe('required');
  });

  it('should properly validate TemplateValidationResult', () => {
    const successResult: TemplateValidationResult = {
      isValid: true
    };

    const errorResult: TemplateValidationResult = {
      isValid: false,
      errors: [
        {
          field: 'label',
          message: 'Label is required'
        }
      ]
    };

    expect(successResult.isValid).toBe(true);
    expect(errorResult.isValid).toBe(false);
    expect(errorResult.errors?.[0].field).toBe('label');
  });

  it('should properly validate TemplateServiceResult', () => {
    const successResult: TemplateServiceResult<Template> = {
      data: {
        id: '1',
        title: 'Test',
        type: 'document',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null
    };

    const errorResult: TemplateServiceResult<Template> = {
      data: null,
      error: new Error('Test error')
    };

    expect(successResult.data?.id).toBe('1');
    expect(errorResult.error).toBeInstanceOf(Error);
  });
});