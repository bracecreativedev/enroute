import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
import RegistrationComplete from '../auth/RegistrationComplete';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password2: '',
      name: '',
      mailchimp: true,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkboxChange = this.checkboxChange.bind(this);
  }

  componentDidMount() {
    document.title = 'Register - En Route Parking';

    if (this.props.auth.isAuthenticated) {
      // if logged in, redirect
      this.props.history.push('/login');
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

  checkboxChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      mailchimp: this.state.mailchimp
    };

    this.props.registerUser(newUser);
  }

  render() {
    const { errors } = this.state;
    const { registrationComplete } = this.props.auth;

    let registrationContent;

    if (!registrationComplete) {
      registrationContent = (
        <div className="register-box">
          <div className="content">
            <div className="header">
              <h1 className="heading">Register</h1>
              <p>Join the parking revolution today!</p>
            </div>

            <form className="form-label form-css-label" noValidate>
              <TextFieldGroupHover
                label="Your full name"
                name="name"
                type="text"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
              />

              <TextFieldGroupHover
                label="Your email address"
                name="email"
                type="text"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />

              <TextFieldGroupHover
                label="Your password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />

              <TextFieldGroupHover
                label="Confirm your password"
                name="password2"
                type="password"
                value={this.state.password2}
                onChange={this.onChange}
                error={errors.password2}
              />
            </form>

            <div className="form-check text-left mb-3">
              <input
                type="checkbox"
                name="mailchimp"
                className="form-check-input"
                id="mailchimp"
                checked={this.state.mailchimp}
                onChange={this.checkboxChange}
              />
              <label className="form-check-label" htmlFor="mailchimp">
                Add me to your mailing list.
              </label>
            </div>

            <p className="terms">
              By registering account on En Route Parking, you're hereby agreeing
              to our{' '}
              <a href="https://www.enrouteparking.com/terms/" target="_blank">
                Terms and Conditions
              </a>
              .
            </p>

            <button
              type="submit"
              onClick={this.onSubmit}
              className="btn btn-green w-100"
            >
              Register
            </button>
          </div>

          <div className="footer">
            <h3 className="heading">
              Already have an account? <Link to="/login">Login</Link>
            </h3>
          </div>
        </div>
      );
    } else {
      registrationContent = (
        <div>
          <RegistrationComplete
            name={this.state.name}
            email={this.state.email}
          />
        </div>
      );
    }

    return (
      <main className="page-container">
        <div className="container">{registrationContent}</div>
      </main>
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
