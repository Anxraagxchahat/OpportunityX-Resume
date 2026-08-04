import React from 'react';

export const TemplateWrapper = ({ children, paperBgColor = '#ffffff', fontFamily = 'Inter', isSidebarLayout = false }) => {
  return (
    <div
      className={`a4-paper-container transition-all duration-200 shadow-2xl rounded-sm text-slate-800 print:shadow-none print:m-0 print:p-0 ${
        isSidebarLayout ? 'p-0 flex min-h-[297mm]' : 'p-10 min-h-[297mm]'
      }`}
      style={{
        backgroundColor: paperBgColor,
        fontFamily: `'${fontFamily}', sans-serif`
      }}
    >
      {children}
    </div>
  );
};
