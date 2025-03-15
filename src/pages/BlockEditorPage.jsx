import React from 'react';
import BlockForm from '../components/BlockForm';
import './BlockEditorPage.css';

const BlockEditorPage = () => {
  const handleSubmit = (blockData) => {
    console.log('Block data submitted:', blockData);
    // Here you would handle saving the block data to your backend or state management
  };

  return (
    <div className="block-editor-page">
      <h1 className="page-title">Create New Block</h1>
      <BlockForm onSubmit={handleSubmit} />
    </div>
  );
};

export default BlockEditorPage;
