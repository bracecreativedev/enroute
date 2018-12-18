import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import {
  getLocations,
  setFeaturedLocation
} from '../../actions/locationActions';
import { getCurrentProfile } from '../../actions/profileActions';
import Pin from './Pin';
import UserPin from './UserPin';
import CompanyPin from './CompanyPin';
import { MapStyles } from './MapStyles';
import isEmpty from '../../validation/is-empty';
import Sidebar from '../sidebar/Sidebar';
import Spinner from '../common/Spinner';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {
        lat: 51.764129,
        lng: -2.334386
      },
      zoom: 9
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    this.props.getLocations();
    this.props.setFeaturedLocation();

    if (isAuthenticated) {
      this.props.getCurrentProfile();
    }
  }

  onClick = (key, childProps) => {
    // this.setState({
    //   center: { lat: childProps.lat, lng: childProps.lng }
    // });
  };

  render() {
    const { locations, featuredLocation } = this.props.locations;
    const { profile, loading } = this.props.profile;
    const { isAuthenticated } = this.props.auth;
    const { center, zoom } = this.state;

    let profilePins;
    let companyPins;

    if (
      !isEmpty(profile) &&
      !isEmpty(profile.address) &&
      !isEmpty(profile.address.lng)
    ) {
      profilePins = (
        <UserPin
          lat={profile.address.lat}
          lng={profile.address.lng}
          profile={profile}
        />
      );
    }

    if (
      !isEmpty(profile) &&
      !isEmpty(profile.company) &&
      !isEmpty(profile.company.lng)
    ) {
      companyPins = (
        <CompanyPin
          lat={profile.company.lat}
          lng={profile.company.lng}
          profile={profile}
        />
      );
    }

    let dashboardContent;

    if (isAuthenticated) {
      if (profile === null || loading) {
        dashboardContent = (
          <div className="page-container">
            <Spinner />
          </div>
        );
      } else {
        // Check if logged in user has profile data
        if (Object.keys(profile).length > 0) {
          dashboardContent = (
            <div>
              {/* // Important! Always set the container height explicitly */}
              <div className="map-container">
                <GoogleMap
                  bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
                  center={center}
                  zoom={zoom}
                  options={MapStyles}
                  onChildClick={this.onClick}
                >
                  {locations.map(location => (
                    <Pin
                      lat={location.location.lat}
                      lng={location.location.lng}
                      location={location}
                      featuredLocation={featuredLocation}
                      key={location._id}
                    />
                  ))}

                  {profilePins}
                  {companyPins}
                </GoogleMap>
              </div>
              <Sidebar />
            </div>
          );
        } else {
          this.props.history.push('/create-profile');
        }
      }
    } else {
      dashboardContent = (
        <div>
          {/* // Important! Always set the container height explicitly */}
          <div className="map-container">
            <GoogleMap
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
              center={center}
              zoom={zoom}
              options={MapStyles}
              onChildClick={this.onClick}
            >
              {locations.map(location => (
                <Pin
                  lat={location.location.lat}
                  lng={location.location.lng}
                  location={location}
                  featuredLocation={featuredLocation}
                  key={location._id}
                />
              ))}

              {profilePins}
            </GoogleMap>
          </div>
          <Sidebar />
        </div>
      );
    }

    return <main className="main-container">{dashboardContent}</main>;
  }
}

Map.propTypes = {
  locations: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  locations: state.locations,
  errors: state.errors,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getLocations, getCurrentProfile, setFeaturedLocation }
)(Map);
