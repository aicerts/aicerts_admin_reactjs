import React from 'react';

const CopyrightNotice = () => {
    const currentYear = new Date().getFullYear();

  return (
      <p className='mb-0'>&copy; {currentYear} AI CERTs. All rights reserved.</p>
  );
};

export default CopyrightNotice;
