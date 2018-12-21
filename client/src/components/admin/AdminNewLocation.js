import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { adminNewLocation } from '../../actions/adminActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
import axios from 'axios';

class AdminNewLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      spaces: '',
      roads: '',
      accessTimes: '',
      street: '',
      postcode: '',
      lat: '',
      lng: '',
      image0: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      active: true,
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
    const images = [];

    images.push(
      { imageURL: this.state.image0 },
      { imageURL: this.state.image1 },
      { imageURL: this.state.image2 },
      { imageURL: this.state.image3 },
      { imageURL: this.state.image4 }
    );

    const locationData = {
      name: this.state.name,
      price: this.state.price,
      spaces: this.state.spaces,
      roads: this.state.roads,
      accessTimes: this.state.accessTimes,
      location: {
        street: this.state.street,
        postcode: this.state.postcode,
        lat: this.state.lat,
        lng: this.state.lng
      },
      images: images,
      active: this.state.active
    };

    axios.post('/api/admin/new-location', locationData).then(newLocation => {
      this.props.history.push(`/admin-panel/location/${newLocation.data._id}`);
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="page-container">
        <div className="container">
          {this.state.updated ? (
            <div
              className="update-alert"
              style={{
                margin: '30px 0',
                padding: '30px',
                borderTop: '10px solid #96c236',
                boxShadow: '0 0 10px rgba(0,0,0,.15)'
              }}
            >
              <p style={{ marginBottom: '0' }}>
                Location information has been updated.
              </p>
            </div>
          ) : null}
          <div className="profile-box">
            <div className="content">
              <div className="header">
                <h1 className="heading">New Location</h1>
                {/* <p>
                  Fill out your En Route profile! We promise to never hand out
                  your info to any other companies, it's used solely to provide
                  a better experience on our website!
                </p> */}
              </div>

              <div className="profile-section">
                <div className="row">
                  <div className="col-md-4">
                    <div className="section-header">
                      <h2 className="heading">Standard Info</h2>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Name *"
                              name="name"
                              type="text"
                              value={this.state.name}
                              onChange={this.onChange}
                              error={errors.name}
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Price *"
                              name="price"
                              type="number"
                              value={this.state.price}
                              onChange={this.onChange}
                              error={errors.price}
                              info="Price is done to the penny e.g. 300 = £3.00"
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Spaces *"
                              name="spaces"
                              type="number"
                              value={this.state.spaces}
                              onChange={this.onChange}
                              error={errors.spaces}
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="En Route Roads *"
                              name="roads"
                              type="text"
                              value={this.state.roads}
                              onChange={this.onChange}
                              error={errors.roads}
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Access Times *"
                              name="accessTimes"
                              type="text"
                              value={this.state.accessTimes}
                              onChange={this.onChange}
                              error={errors.accessTimes}
                            />
                          </div>

                          <div className="col-md-6">
                            <small
                              className="mb-0"
                              style={{
                                color: '#96c236',
                                fontWeight: 500,
                                fontSize: '12px'
                              }}
                            >
                              Active?
                            </small>
                            <select
                              className="form-control"
                              name="active"
                              onChange={this.onChange}
                              id="exampleFormControlSelect1"
                              value={this.state.active}
                            >
                              <option value={true}>true</option>
                              <option value={false}>false</option>
                            </select>
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
                      <h2 className="heading">Address Info</h2>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Street *"
                              name="street"
                              type="text"
                              value={this.state.street}
                              onChange={this.onChange}
                              error={errors.street}
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Postcode *"
                              name="postcode"
                              type="text"
                              value={this.state.postcode}
                              onChange={this.onChange}
                              error={errors.postcode}
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Latitudinal Value *"
                              name="lat"
                              type="number"
                              value={this.state.lat}
                              onChange={this.onChange}
                              error={errors.lat}
                              info="Lat and long values can be found by right clicking your location on the normal google maps and clicking 'What's here?'"
                            />
                          </div>

                          <div className="col-md-6">
                            <TextFieldGroupHover
                              label="Longitudinal Value *"
                              name="lng"
                              type="number"
                              value={this.state.lng}
                              onChange={this.onChange}
                              error={errors.lng}
                            />
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
                      <h2 className="heading">Images</h2>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="section-forms">
                      <form className="form-label form-css-label">
                        <div className="row">
                          <div className="col-md-12">
                            <TextFieldGroupHover
                              label="Featured Image"
                              name="image0"
                              type="text"
                              value={this.state.image0}
                              onChange={this.onChange}
                              error={errors.image0}
                            />

                            <TextFieldGroupHover
                              label="Featured Image"
                              name="image1"
                              type="text"
                              value={this.state.image1}
                              onChange={this.onChange}
                              error={errors.image1}
                            />

                            <TextFieldGroupHover
                              label="Featured Image"
                              name="image2"
                              type="text"
                              value={this.state.image2}
                              onChange={this.onChange}
                              error={errors.image2}
                            />

                            <TextFieldGroupHover
                              label="Featured Image"
                              name="image3"
                              type="text"
                              value={this.state.image3}
                              onChange={this.onChange}
                              error={errors.image3}
                            />

                            <TextFieldGroupHover
                              label="Featured Image"
                              name="image4"
                              type="text"
                              value={this.state.image4}
                              onChange={this.onChange}
                              error={errors.image4}
                            />
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
                  Create New Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.admin
});

export default withRouter(
  connect(
    mapStateToProps,
    { adminNewLocation }
  )(AdminNewLocation)
);
