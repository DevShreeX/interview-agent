import React from 'react';

const Badge = ({ children, tone = 'electric', ...props }) => (
  <span className={`badge badge-${tone}`} {...props}>
    {children}
  </span>
);

export default Badge;
