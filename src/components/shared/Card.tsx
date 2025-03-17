import React from 'react';
import Image from 'next/image';

interface CardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  type: 'project' | 'template';
  onClick: (id: string) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  image,
  date,
  type,
  onClick,
}) => {
  return (
    <div 
      className={`card-container ${type}-card`}
      onClick={() => onClick(id)}
    >
      {image && (
        <div className="card-image">
          <Image 
            src={image} 
            alt={title} 
            width={280} 
            height={160} 
            objectFit="cover"
          />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-footer">
          <span className="card-date">{new Date(date).toLocaleDateString()}</span>
          <span className="card-type">{type === 'project' ? 'Project' : 'Template'}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
