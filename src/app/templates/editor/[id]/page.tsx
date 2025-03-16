"use client";
import React from 'react';
import BlockEditorPage from '../components/BlockEditorPage';

export default function TemplateEditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen">
      <BlockEditorPage templateId={params.id !== 'new' ? params.id : undefined} />
    </div>
  );
}