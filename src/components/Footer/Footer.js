import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <div className={'footer-container'}>
      <h2>
        Developer :{' '}
        <a
          href='https://github.com/cpwallah'
          rel='noopener noreferrer'
          target='_blank'
        >
          Shivansh Negi
        </a>{' '}
      </h2>
    </div>
  );
};

export default Footer;
