import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateEmail,
  updatePassword,
  updateName,
  resetAccountUpdate
} from '../../actions/authActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';

class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      newName: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordChanged: false,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.emailChangeSubmit = this.emailChangeSubmit.bind(this);
    this.passwordChangeSubmit = this.passwordChangeSubmit.bind(this);
    this.nameChangeSubmit = this.nameChangeSubmit.bind(this);
  }

  componentDidMount() {
    const { user } = this.props.auth;

    document.title = 'Edit Account - En Route Parking';

    // empties all errors etc.
    this.props.resetAccountUpdate();

    this.setState({ email: user.email, newName: user.name });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  nameChangeSubmit(e) {
    e.preventDefault();

    const nameData = {
      newName: this.state.newName
    };

    this.props.updateName(nameData);
  }

  emailChangeSubmit(e) {
    e.preventDefault();

    const emailData = {
      email: this.state.email
    };

    this.props.updateEmail(emailData);
  }

  passwordChangeSubmit(e) {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = this.state;
    // const { errors } = this.props;

    const passwordData = {
      oldPassword,
      newPassword,
      confirmPassword
    };

    this.props.updatePassword(passwordData);
  }

  render() {
    const { errors } = this.props;
    const {
      passwordChanged,
      emailChanged,
      nameChanged
    } = this.props.auth.accountUpdate;

    return (
      <div className="page-container">
        <div className="container">
          <div className="profile-box">
            <div className="content">
              <div className="header">
                <h1 className="heading">Edit your account</h1>
                <p>
                  Edit all of your account details here. These are used for all
                  sorts of authorisation around the website so please make sure
                  to keep note of any changes you make!
                </p>
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Name</h2>
                      <p>Update the name linked to your En Route account.</p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section">
                      <form
                        onSubmit={this.nameChangeSubmit}
                        className="form-label form-css-label"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Your name"
                                name="newName"
                                type="text"
                                value={this.state.newName}
                                onChange={this.onChange}
                                error={errors.newName}
                              />
                            </fieldset>

                            {nameChanged ? (
                              <p
                                className="my-3"
                                style={{ color: '#96c236', fontWeight: '600' }}
                              >
                                Name successfully changed!
                              </p>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-green mt-3"
                              >
                                Change Name
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Email Address</h2>
                      <p>
                        You can update your En Route email address but please
                        make sure you keep a note of what you've changed it to.
                        This email address is used to log in to your account!
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section">
                      <form
                        onSubmit={this.emailChangeSubmit}
                        className="form-label form-css-label"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Email Address"
                                name="email"
                                type="text"
                                value={this.state.email}
                                onChange={this.onChange}
                                error={errors.email}
                              />
                            </fieldset>

                            {emailChanged ? (
                              <p
                                className="my-3"
                                style={{ color: '#96c236', fontWeight: '600' }}
                              >
                                Email successfully changed!
                              </p>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-green mt-3"
                              >
                                Change Email
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Password</h2>
                      <p>
                        Update your account password, please take a note of what
                        you've changed your password to. Password changes cannot
                        be reverted.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section">
                      <form
                        onSubmit={this.passwordChangeSubmit}
                        className="form-label form-css-label"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Current Password"
                                name="oldPassword"
                                type="password"
                                value={this.state.oldPassword}
                                onChange={this.onChange}
                                error={errors.oldPassword}
                              />
                            </fieldset>

                            {/* New passwords */}
                            <fieldset>
                              <TextFieldGroupHover
                                label="New Password"
                                name="newPassword"
                                type="password"
                                value={this.state.newPassword}
                                onChange={this.onChange}
                                error={errors.newPassword}
                              />
                            </fieldset>

                            <fieldset>
                              <TextFieldGroupHover
                                label="Confirm New Password"
                                name="confirmPassword"
                                type="password"
                                value={this.state.confirmPassword}
                                onChange={this.onChange}
                                error={errors.confirmPassword}
                              />
                            </fieldset>

                            {passwordChanged ? (
                              <p
                                className="my-3"
                                style={{ color: '#96c236', fontWeight: '600' }}
                              >
                                Password successfully changed!
                              </p>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-green mt-3"
                              >
                                Change Password
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updateEmail, updatePassword, updateName, resetAccountUpdate }
)(EditAccount);
