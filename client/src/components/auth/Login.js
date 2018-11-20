import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { Link } from 'react-router-dom';

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

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="col-md-6 m-auto">
          <div className="login p-3 mt-3">
            <h1 className="text-center font-weight-bold text-neon">LOG IN</h1>
            <p className="text-center">Sign in to your En Route account.</p>
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Email"
                name="email"
                type="text"
                customClass="post-form"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />

              <TextFieldGroup
                placeholder="Password"
                name="password"
                type="password"
                customClass="post-form"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              <button
                type="submit"
                className="btn btn-outline-neon btn-lg btn-block mt-4"
              >
                LOG IN
              </button>
            </form>
            <p className="text-center p-0 m-0 mt-3">
              Not got an account? <Link to="/register">Register Here</Link>
            </p>
          </div>
          <p className="mt-3 mb-3 text-center">&copy; En Route</p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
