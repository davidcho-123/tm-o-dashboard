import React from 'react';

export function Button({children, className='', ...props}: any){return <button {...props} className={"px-3 py-2 rounded-lg " + className}>{children}</button>}