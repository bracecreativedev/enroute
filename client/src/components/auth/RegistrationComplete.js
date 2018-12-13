import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationComplete = ({ name, email }) => {
  return (
    <div className="register-box">
      <div className="content">
        <div className="header mb-0">
          <h1 className="heading">
            Thanks for registering{name ? `, ${name}!` : '!'}
          </h1>
          {!email ? (
            <p>
              We've sent you a confirmation email, please confirm your account
              to start using En Route Parking!
            </p>
          ) : (
            <p>
              We've sent a confirmation email to{' '}
              <span className="font-weight-bold">{email}</span>, please confirm
              your email address to start using En Route Parking!
            </p>
          )}
        </div>
      </div>

      <div className="footer">
        <Link to="/login" className="btn btn-green">
          Login &rarr;
        </Link>
      </div>
    </div>
  );
};

export default RegistrationComplete;
