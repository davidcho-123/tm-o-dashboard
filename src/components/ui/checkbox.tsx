import React from 'react';

export const Checkbox = ({checked, ...props}: any)=> <input type='checkbox' checked={checked} {...props} />;