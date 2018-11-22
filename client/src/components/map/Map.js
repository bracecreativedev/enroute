import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import { getLocations } from '../../actions/locationActions';
import { getCurrentProfile } from '../../actions/profileActions';
import Pin from './Pin';
import UserPin from './UserPin';
import { MapStyles } from './MapStyles';
import isEmpty from '../../validation/is-empty';
import Sidebar from '../sidebar/Sidebar';

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

    if (isAuthenticated) {
      this.props.getCurrentProfile();
    }
  }

  onClick = (key, childProps) => {
    this.setState({
      center: { lat: childProps.lat, lng: childProps.lng }
    });

    console.log(this.state.zoom);
  };

  render() {
    const { locations, featuredLocation } = this.props.locations;
    const { profile } = this.props.profile;
    const { center, zoom } = this.state;

    let profilePins;

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

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* // Important! Always set the container height explicitly */}
          <div
            style={{
              height: '100vh',
              position: 'fixed',
              left: '0',
              right: '400px'
            }}
          >
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations,
  errors: state.errors,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getLocations, getCurrentProfile }
)(Map);
