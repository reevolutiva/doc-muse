import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { X } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: any;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
}

const PropertiesPanel = ({ selectedNode, onClose, onUpdate }: PropertiesPanelProps) => {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    isRequired: false,
    prompt: '',
  });

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        label: selectedNode.data.label || '',
        description: selectedNode.data.description || '',
        isRequired: selectedNode.data.isRequired || false,
        prompt: selectedNode.data.prompt || '',
      });
    }
  }, [selectedNode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNode) {
      onUpdate(selectedNode.id, {
        ...selectedNode.data,
        ...formData,
      });
    }
  };

  if (!selectedNode) return null;

  return (
    <Card className="w-80 absolute right-0 top-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <h3 className="text-lg font-medium">Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
            />
            <Label htmlFor="required">Required</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">AI Generation Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              rows={4}
              placeholder="Enter a prompt for AI content generation..."
            />
          </div>

          <Button type="submit" className="w-full">
            Update Properties
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;