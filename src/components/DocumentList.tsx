import React, { useState } from 'react';

interface Document {
  id: number;
  name: string;
}

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const filteredDocuments = documents
    .filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
  return (
    <div className="document-list">
      <div className="document-list-header">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort {sortOrder === 'asc' ? '↓' : '↑'}
        </button>
      </div>
      <ul className="document-items">
        {filteredDocuments.map(doc => (
          <li key={doc.id} className="document-item">{doc.name}</li>
        ))}
      </ul>
      {filteredDocuments.length === 0 && <p>No documents found.</p>}
    </div>
  );
};

export default DocumentList;
