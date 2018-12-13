import React from 'react';
import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <div className="page-container">
      <div className="container">
        <div className="generic-box">
          <div className="main-content">
            <div className="header">
              <h1 className="heading">404, there's an issue here.</h1>
              <p className="subheading">
                The page you're looking for cannot be found! If you think
                there's something wrong on our end, please shoot us an email!{' '}
                <a href="mailto: info@enrouteparking.com">
                  info@enrouteparking.com
                </a>
              </p>
            </div>

            <div className="footer">
              <Link to="/" className="btn btn-green">
                &larr; Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
