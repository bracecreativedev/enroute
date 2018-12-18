import React, { Component } from 'react';
import axios from 'axios';
import TextFieldGroupHover from '../common/TextFieldGroupHover';

class ForgottenPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      submitPressed: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    e.preventDefault();

    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state.email);
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ submitPressed: true });

    const submitData = {
      email: this.state.email
    };

    axios.post('/api/auth/forgotten-password', submitData);
  }

  render() {
    const { errors, submitPressed } = this.state;

    let forgottenPasswordContent;

    if (!submitPressed) {
      forgottenPasswordContent = (
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
              label="Email"
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
            />

            <button type="submit" className="btn btn-green w-100">
              Send Email
            </button>
          </form>
        </div>
      );
    } else {
      forgottenPasswordContent = (
        <div className="content">
          <div className="header">
            <h1 className="heading">Email sent!</h1>
            <p>
              An email has been sent to {this.state.email}, if there's an
              account linked to this email, instructions will be sent to reset
              your password.
            </p>
          </div>
        </div>
      );
    }

    return (
      <main className="page-container">
        <div className="container">
          <div className="login-box">{forgottenPasswordContent}</div>
        </div>
      </main>
    );
  }
}

export default ForgottenPassword;
