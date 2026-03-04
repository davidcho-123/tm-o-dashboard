import React from 'react';

export function Badge({children, className='', variant='', ...props}: any){return <span {...props} className={"inline-block px-2 py-1 rounded-full text-xs "+className}>{children}</span>}