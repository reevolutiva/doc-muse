"use client"

import { Suspense } from 'react';
import TemplateCanvas from '@/components/template-manager/TemplateCanvas';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}

export default function VisualEditorPage() {
  return (
    <div className="h-screen w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <TemplateCanvas />
      </Suspense>
    </div>
  );
}