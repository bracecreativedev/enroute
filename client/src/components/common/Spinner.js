import React from 'react';
import spinner from './spinner.gif';

export default () => {
  return (
    <div>
      <img
        src={spinner}
        style={{
          width: '150px',
          margin: 'auto',
          padding: '50px',
          display: 'block'
        }}
        alt="Loading..."
      />
    </div>
  );
};
