import React from 'react';

const Card = ({ children, as: Tag = 'div', interactive = false, ...props }) => (
  <Tag className={`card${interactive ? ' card-interactive' : ''}`} {...props}>
    {children}
  </Tag>
);

export default Card;
