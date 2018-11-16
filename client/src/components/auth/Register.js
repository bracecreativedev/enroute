import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      password2: '',
      name: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      // if logged in, redirect
      this.props.histroy.push('/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="col-md-6 m-auto">
          <div className="login p-3 rounded mt-3 box-shadow">
            <h1 className="font-weight-bold text-center">REGISTER</h1>
            <p className="text-center">Create your En Route account</p>
            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Name"
                name="name"
                customClass="post-form"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
              />

              <TextFieldGroup
                placeholder="Email"
                name="email"
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

              <TextFieldGroup
                placeholder="Confirm Password"
                name="password2"
                type="password"
                customClass="post-form"
                value={this.state.password2}
                onChange={this.onChange}
                error={errors.password2}
              />

              <button
                type="submit"
                className="btn btn-outline-neon btn-lg btn-block mt-4"
              >
                REGISTER
              </button>
            </form>
          </div>
          <p className="mt-3 mb-3 text-center">&copy; En Route</p>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
