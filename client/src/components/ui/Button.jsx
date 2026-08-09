import React from 'react';

const Button = ({ variant = 'primary', as: Tag = 'button', children, ...props }) => (
  <Tag className={`btn ${variant !== 'ghost' ? `btn-${variant}` : ''}`} {...props}>
    {children}
  </Tag>
);

export default Button;
