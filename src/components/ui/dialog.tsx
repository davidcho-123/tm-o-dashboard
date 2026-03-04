import React from 'react';

import * as React from 'react';
export function Dialog({children, open, onOpenChange}: any){ return <div>{children}</div> }
export function DialogContent({children, className='', ...props}: any){ return <div {...props} className={className}>{children}</div> }
export function DialogHeader({children, className='', ...props}: any){ return <div {...props} className={className}>{children}</div> }
export function DialogTitle({children, className='', ...props}: any){ return <div {...props} className={className}>{children}</div> }
export function DialogTrigger({children, ...props}: any){ return <>{children}</> }
export function DialogFooter({children, ...props}: any){ return <div {...props}>{children}</div> }
