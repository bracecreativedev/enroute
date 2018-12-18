import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import { setFeaturedLocation } from '../../actions/locationActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
import { Link, Redirect } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
    // reset featured location data
    this.props.setFeaturedLocation();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.props;
    const { isAuthenticated } = this.props.auth;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    // if authenticated, redirect to previous path
    if (isAuthenticated) {
      return <Redirect to={from} />;
    }

    return (
      <main className="page-container">
        <div className="container">
          <div className="login-box">
            <div className="content">
              <div className="header">
                <h1 className="heading">Welcome back!</h1>
                <p>Login to your En Route Parking account!</p>
              </div>

              <form
                className="form-label form-css-label"
                onSubmit={this.onSubmit}
              >
                <TextFieldGroupHover
                  label="Email"
                  name="email"
                  type="text"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <TextFieldGroupHover
                  label="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <button type="submit" className="btn btn-green w-100">
                  Login
                </button>
              </form>
            </div>

            <div className="footer">
              <h3 className="heading">
                Forgotten your password?{' '}
                <Link to="/forgotten-password">Reset Password</Link>
                <br />
                Don't have an account? <Link to="/register">Register</Link>
              </h3>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  setFeaturedLocation: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, setFeaturedLocation }
)(Login);
