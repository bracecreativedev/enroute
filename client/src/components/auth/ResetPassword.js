import React, { Component } from 'react';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
import axios from 'axios';
import isEmpty from '../../validation/is-empty';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPassword: '',
      confirmPassword: '',
      passwordReset: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();

    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { newPassword, confirmPassword } = this.state;

    const passwordData = {
      newPassword,
      confirmPassword
    };

    if (
      !isEmpty(newPassword) &&
      !isEmpty(confirmPassword) &&
      newPassword === confirmPassword
    ) {
      axios
        .post(
          `/api/auth/reset-password/${this.props.match.params.token}`,
          passwordData
        )
        .then(this.setState({ passwordReset: true }))
        .catch(err => this.setState({ errors: err }));
    } else {
      this.setState({
        errors: {
          newPassword: 'Passwords must match'
        }
      });
    }
  }

  render() {
    const { errors, passwordReset } = this.state;

    let passwordResetContent;

    if (!passwordReset) {
      passwordResetContent = (
        <div className="content">
          <div className="header">
            <h1 className="heading">Forgotten your password?</h1>
            <p>
              Submit your email account below and if there's an account
              registered to that email address we'll send you instructions to
              reset your password!
            </p>
          </div>

          <form className="form-label form-css-label" onSubmit={this.onSubmit}>
            <TextFieldGroupHover
              label="New Password"
              name="newPassword"
              type="password"
              value={this.state.newPassword}
              onChange={this.onChange}
              error={errors.newPassword}
            />

            <TextFieldGroupHover
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={this.state.confirmPassword}
              onChange={this.onChange}
              error={errors.confirmPassword}
            />

            <button type="submit" className="btn btn-green w-100">
              Change Password
            </button>
          </form>
        </div>
      );
    } else {
      passwordResetContent = (
        <div className="content">
          <div className="header">
            <h1 className="heading">Password reset!</h1>
            <p>
              If there were no issues with the URL used, your password will have
              been reset!
            </p>
          </div>
        </div>
      );
    }

    return (
      <main className="page-container">
        <div className="container">
          <div className="login-box">{passwordResetContent}</div>
        </div>
      </main>
    );
  }
}

export default ResetPassword;
