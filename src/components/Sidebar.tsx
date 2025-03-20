import React, { useState } from 'react';

interface SidebarProps {
  items: string[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${className}`}
      data-testid="sidebar"
    >
      <div className="sidebar-header">
        <button 
          onClick={toggleSidebar}
          data-testid="sidebar-toggle"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>
      <ul className="sidebar-items">
        {items.map((item, index) => (
          <li key={index} className="sidebar-item">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
