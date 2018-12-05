import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroupHover from '../../components/common/TextFieldGroupHover';
import TextAreaFieldGroupHover from '../../components/common/TextAreaFieldGroupHover';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import Spinner from '../../components/common/Spinner';

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

  componentDidMount() {
    this.props.getCurrentProfile();
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
    const { profile, loading } = this.props.profile;

    let ProfileContent;

    if (profile === null || loading) {
      ProfileContent = (
        <div className="page-container">
          <Spinner />
        </div>
      );
    } else if (Object.keys(profile).length > 0) {
      // check if profile is empty
      this.props.history.push('/');
    } else {
      ProfileContent = (
        <div className="container">
          <div className="profile-box">
            <div className="content">
              <div className="header">
                <h1 className="heading">Create your profile</h1>
                <p>
                  Fill out your En Route profile! We promise to never hand out
                  your info to any other companies, it's used solely to provide
                  a better experience on our website!
                </p>
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Contact Info</h2>
                      <p>
                        Your contact information is required in case we need to
                        get hold of you whilst your car is parked at an En Route
                        location. It's never used outside of this reason!
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Your phone number *"
                                name="phone"
                                type="text"
                                value={this.state.phone}
                                onChange={this.onChange}
                                error={errors.phone}
                              />
                            </fieldset>
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
                      <h2 className="heading">Vehicle Info</h2>
                      <p>
                        Your vehicle info is required so that we can monitor
                        your vehicle in our En Route Parkings locations. It will
                        never be used outside of this!
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Vehicle reg *"
                                name="reg"
                                type="text"
                                value={this.state.reg}
                                onChange={this.onChange}
                                error={errors.reg}
                              />
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Vehicle make"
                                name="make"
                                type="text"
                                value={this.state.make}
                                onChange={this.onChange}
                                error={errors.make}
                              />
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Vehicle model"
                                name="model"
                                type="text"
                                value={this.state.model}
                                onChange={this.onChange}
                                error={errors.model}
                              />
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Vehicle colour"
                                name="colour"
                                type="text"
                                value={this.state.colour}
                                onChange={this.onChange}
                                error={errors.colour}
                              />
                            </fieldset>
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
                      <h2 className="heading">Home Address</h2>
                      <p>
                        Your home address is used to set a map marker so that
                        you can check the proximity of En Route Parking
                        locations to your home.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-12">
                            <fieldset>
                              <TextAreaFieldGroupHover
                                label="Your address"
                                name="street"
                                type="text"
                                value={this.state.street}
                                onChange={this.onChange}
                                error={errors.street}
                              />
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Your postcode"
                                name="postcode"
                                type="text"
                                value={this.state.postcode}
                                onChange={this.onChange}
                                error={errors.postcode}
                              />
                            </fieldset>
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
                      <h2 className="heading">Company Info</h2>
                      <p>
                        Your home address is used to set a map marker so that
                        you can check the proximity of En Route Parking
                        locations to your company offices.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Company name"
                                name="companyName"
                                type="text"
                                value={this.state.companyName}
                                onChange={this.onChange}
                                error={errors.companyName}
                              />
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <fieldset>
                              <TextFieldGroupHover
                                label="Company postcode"
                                name="companyPostcode"
                                type="text"
                                value={this.state.companyPostcode}
                                onChange={this.onChange}
                                error={errors.companyPostcode}
                              />
                            </fieldset>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-footer">
                <a
                  href="#top"
                  onClick={this.onSubmit}
                  className="btn btn-green"
                >
                  Submit
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="page-container">{ProfileContent}</div>;
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
  { createProfile, getCurrentProfile }
)(CreateProfile);
