import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateEmail } from '../../actions/authActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';

class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.emailChangeSubmit = this.emailChangeSubmit.bind(this);
  }

  componentDidMount() {
    const { user } = this.props.auth;

    this.setState({ email: user.email });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  emailChangeSubmit(e) {
    e.preventDefault();

    const emailData = {
      email: this.state.email
    };

    this.props.updateEmail(emailData);
  }

  render() {
    const { errors } = this.props;
    return (
      <div className="page-container">
        <div className="container">
          <div className="profile-box">
            <div className="content">
              <div className="header">
                <h1 className="heading">Edit your account</h1>
                <p>...</p>
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Email Address</h2>
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

                            <button
                              type="submit"
                              className="btn btn-green mt-3"
                            >
                              Change Email
                            </button>
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
                      <h2 className="heading">Change Password</h2>
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
                                label="Password"
                                name="password"
                                type="password"
                                value={this.state.email}
                                onChange={this.onChange}
                                error={errors.email}
                              />
                            </fieldset>

                            <button
                              type="submit"
                              className="btn btn-green mt-3"
                            >
                              Change Password
                            </button>
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
  { updateEmail }
)(EditAccount);
