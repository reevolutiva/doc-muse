import React, { useState } from 'react';
import './BlockForm.css';

const BlockForm = ({ onSubmit, initialData = {} }) => {
  const [blockData, setBlockData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    systemPrompt: initialData.systemPrompt || '',
    content: initialData.content || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlockData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(blockData);
  };

  return (
    <form className="block-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-group">
          <label htmlFor="title">Block Setting</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blockData.title}
            onChange={handleChange}
            placeholder="Enter block title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Block Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={blockData.description}
            onChange={handleChange}
            placeholder="Enter block description"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="systemPrompt">AI System Prompt</label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            value={blockData.systemPrompt}
            onChange={handleChange}
            placeholder="Enter AI system prompt"
            rows={3}
          ></textarea>
        </div>
      </div>
      
      <div className="text-editor-bar">
        <div className="editor-actions">
          {/* Here you can add formatting buttons like bold, italic, etc. */}
        </div>
        
        <div className="editor-container">
          <textarea
            id="content"
            name="content"
            value={blockData.content}
            onChange={handleChange}
            placeholder="Start writing..."
            rows={8}
            className="main-text-area"
          ></textarea>
        </div>
        
        <div className="blocks-container">
          {/* Here you can render block buttons or components */}
          <button type="button" className="block-button">Text Block</button>
          <button type="button" className="block-button">Image Block</button>
          <button type="button" className="block-button">Code Block</button>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-button">Save Block</button>
      </div>
    </form>
  );
};

export default BlockForm;
