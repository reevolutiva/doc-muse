import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenido al panel de control de Doc-Muse.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Documentos Recientes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Documentos Recientes</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">No hay documentos recientes.</p>
              <Link href="/documents" className="text-sm text-blue-600 hover:text-blue-800">
                Ver todos los documentos
              </Link>
            </div>
          </div>
          
          {/* Tarjeta de Plantillas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Plantillas</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Accede a las plantillas disponibles.</p>
              <Link href="/templates" className="text-sm text-blue-600 hover:text-blue-800">
                Explorar plantillas
              </Link>
            </div>
          </div>
          
          {/* Tarjeta de Estadísticas */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total de documentos:</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Plantillas utilizadas:</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Volver a inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
