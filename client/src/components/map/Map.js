import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import { getLocations } from '../../actions/locationActions';
import Pin from './Pin';
import { MapStyles } from './MapStyles';
import isEmpty from '../../validation/is-empty';

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
    this.props.getLocations();
  }

  onClick = (key, childProps) => {
    this.setState({
      center: { lat: childProps.lat, lng: childProps.lng },
      zoom: 12
    });

    console.log(this.state.zoom);
  };

  render() {
    const { locations, featuredLocation } = this.props.locations;
    const { center, zoom } = this.state;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '80vh', width: '100%' }}>
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
              key={location._id}
            />
          ))}
        </GoogleMap>

        {!isEmpty(featuredLocation) ? (
          <div>
            <h1>
              <strong>{featuredLocation.name}</strong>
            </h1>
            <p class="mb-0">{featuredLocation.location.street}</p>
            <p class="mb-0">{featuredLocation.location.postcode}</p>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getLocations }
)(Map);
