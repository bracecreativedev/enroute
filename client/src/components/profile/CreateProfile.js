import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      occupation: '',
      gender: '',
      dob: '',
      reg: '',
      make: '',
      model: '',
      colour: '',
      street: '',
      postcode: '',
      companyName: '',
      companyPostcode: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      phone: this.state.phone,
      occupation: this.state.occupation,
      gender: this.state.gender,
      dob: this.state.dob,
      reg: this.state.reg,
      make: this.state.make,
      model: this.state.model,
      colour: this.state.colour,
      street: this.state.street,
      postcode: this.state.postcode,
      companyName: this.state.companyName,
      companyPostcode: this.state.companyPostcode
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create your profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <small className="d-block pb-3">* = required fields</small>

              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Phone Number"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.onChange}
                  error={errors.phone}
                  info="Your phone number in case we ever have to get in contact with you for emergency purposes"
                />

                <TextFieldGroup
                  placeholder="* Car Registration"
                  name="reg"
                  value={this.state.reg}
                  onChange={this.onChange}
                  error={errors.reg}
                />

                <TextFieldGroup
                  placeholder="* Car Make"
                  name="make"
                  value={this.state.make}
                  onChange={this.onChange}
                  error={errors.make}
                />

                <TextFieldGroup
                  placeholder="* Car Model"
                  name="model"
                  value={this.state.model}
                  onChange={this.onChange}
                  error={errors.model}
                />

                <TextFieldGroup
                  placeholder="* Car Colour"
                  name="colour"
                  value={this.state.colour}
                  onChange={this.onChange}
                  error={errors.colour}
                />

                <TextFieldGroup
                  placeholder="Your Address"
                  name="street"
                  value={this.state.street}
                  onChange={this.onChange}
                  error={errors.street}
                />

                <TextFieldGroup
                  placeholder="Your Postcode"
                  name="postcode"
                  value={this.state.postcode}
                  onChange={this.onChange}
                  error={errors.postcode}
                />

                <TextFieldGroup
                  placeholder="Company Name"
                  name="companyName"
                  value={this.state.companyName}
                  onChange={this.onChange}
                  error={errors.companyName}
                />

                <TextFieldGroup
                  placeholder="Company Postcode"
                  name="companyPostcode"
                  value={this.state.companyPostcode}
                  onChange={this.onChange}
                  error={errors.companyPostcode}
                />

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile }
)(CreateProfile);
