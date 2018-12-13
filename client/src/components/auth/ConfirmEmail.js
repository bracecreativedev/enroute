import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/is-empty';

class ConfirmEmail extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    axios
      .get(`/api/auth/confirmation/${this.props.match.params.token}`)
      .then(user => {
        this.setState({ user: user.data, loading: false });
        console.log(user);
        console.log('Stage 2: Loading ' + this.state.loading);
      });
  }

  render() {
    const { user } = this.state;
    console.log(this.state.user);

    return (
      <div className="page-container">
        <div className="container">
          <div className="register-box" style={{ maxWidth: '700px' }}>
            <div className="content">
              <div className="header mb-0">
                <h1 className="heading">
                  Thanks{!isEmpty(user) ? ` ${user.name}` : null}, your email
                  has been confirmed!
                </h1>

                {!isEmpty(user) ? (
                  <p>
                    You can now log in to your account using{' '}
                    <span className="font-weight-bold">{user.email}</span> and
                    start booking parking spaces!
                  </p>
                ) : (
                  <p>
                    You can now log in to your account and start booking parking
                    spaces!
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
        </div>
      </div>
    );
  }
}

export default ConfirmEmail;
