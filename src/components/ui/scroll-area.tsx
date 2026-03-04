import React from 'react';

export const ScrollArea = ({children, className='', ...props}: any)=> <div style={{overflow:'auto'}} className={className} {...props}>{children}</div>;