// Converted from ProjectList.js to TypeScript

import React from 'react';
import { Project } from '../types/Project';

interface ProjectListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  filter?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect, filter = '' }) => {
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(filter.toLowerCase()) ||
    project.description.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div className="project-list-container">
      {filteredProjects.length === 0 ? (
        <p className="no-projects">No projects match your search criteria.</p>
      ) : (
        <ul className="project-list">
          {filteredProjects.map(project => (
            <li key={project.id} onClick={() => onSelect(project)}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="date">{new Date(project.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
