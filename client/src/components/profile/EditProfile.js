import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import TextFieldGroup from '../common/TextFieldGroup';
import isEmpty from '../../validation/is-empty';

class EditProfile extends Component {
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

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // If profile field doesnt exist, make empty string
      profile.phone = !isEmpty(profile.phone) ? profile.phone : '';
      profile.occupation = !isEmpty(profile.occupation)
        ? profile.occupation
        : '';
      profile.gender = !isEmpty(profile.gender) ? profile.gender : '';
      profile.dob = !isEmpty(profile.dob) ? profile.dob : '';
      profile.reg = !isEmpty(profile.vehicle.reg) ? profile.vehicle.reg : '';
      profile.make = !isEmpty(profile.vehicle.make) ? profile.vehicle.make : '';
      profile.model = !isEmpty(profile.vehicle.model)
        ? profile.vehicle.model
        : '';
      profile.colour = !isEmpty(profile.vehicle.colour)
        ? profile.vehicle.colour
        : '';
      profile.street = !isEmpty(profile.address.street)
        ? profile.address.street
        : '';
      profile.postcode = !isEmpty(profile.address.postcode)
        ? profile.address.postcode
        : '';
      profile.companyName = !isEmpty(profile.company.name)
        ? profile.company.name
        : '';
      profile.companyPostcode = !isEmpty(profile.company.postcode)
        ? profile.company.postcode
        : '';

      // Set component fields state
      this.setState({
        phone: profile.phone,
        occupation: profile.occupation,
        gender: profile.gender,
        dob: profile.dob,
        reg: profile.reg,
        make: profile.make,
        model: profile.model,
        colour: profile.colour,
        street: profile.street,
        postcode: profile.postcode,
        companyName: profile.companyName,
        companyPostcode: profile.companyPostcode
      });
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
      <div>
        <div className="create-profile">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Create your profile</h1>
                <p className="lead text-center">
                  Let's get some information to make your profile stand out
                </p>
                <small className="d-block pb-3">* = required fields</small>

                <form onSubmit={this.onSubmit} className="text-left">
                  <label>Phone Number *</label>
                  <TextFieldGroup
                    placeholder="Phone Number"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.onChange}
                    error={errors.phone}
                    info="Your phone number in case we ever have to get in contact with you for emergency purposes"
                  />

                  <label>Vehicle Registration *</label>
                  <TextFieldGroup
                    placeholder="Vehicle Registration"
                    name="reg"
                    value={this.state.reg}
                    onChange={this.onChange}
                    error={errors.reg}
                  />

                  <label>Vehicle Make *</label>
                  <TextFieldGroup
                    placeholder="Vehicle Make"
                    name="make"
                    value={this.state.make}
                    onChange={this.onChange}
                    error={errors.make}
                  />

                  <label>Vehicle Model *</label>
                  <TextFieldGroup
                    placeholder="Vehicle Model"
                    name="model"
                    value={this.state.model}
                    onChange={this.onChange}
                    error={errors.model}
                  />

                  <label>Vehicle Colour *</label>
                  <TextFieldGroup
                    placeholder="Vehicle Colour"
                    name="colour"
                    value={this.state.colour}
                    onChange={this.onChange}
                    error={errors.colour}
                  />

                  <label>Your Address</label>
                  <TextFieldGroup
                    placeholder="Your Address"
                    name="street"
                    value={this.state.street}
                    onChange={this.onChange}
                    error={errors.street}
                  />

                  <label>Your Postcode</label>
                  <TextFieldGroup
                    placeholder="Your Postcode"
                    name="postcode"
                    value={this.state.postcode}
                    onChange={this.onChange}
                    error={errors.postcode}
                  />

                  <label>Company Name</label>
                  <TextFieldGroup
                    placeholder="Company Name"
                    name="companyName"
                    value={this.state.companyName}
                    onChange={this.onChange}
                    error={errors.companyName}
                  />

                  <label>Company Postcode</label>
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
      </div>
    );
  }
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(EditProfile);
