import React, { Component } from 'react';
import GoogleMap from 'google-map-react';

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: 'white',
      background: 'grey',
      padding: '15px 10px',
      display: 'inline-flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '100%',
      transform: 'translate(-50%, -50%)'
    }}
  >
    {text}
  </div>
);

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 51.764129,
      lng: -2.334386
    },
    zoom: 9
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMap
          bootstrapURLKeys={{ key: 'AIzaSyAS5BxkWOQsvH_feYdDpdOH7vwQAopdj4c' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={51.764129}
            lng={-2.334386}
            text={'Fromebridge Mill'}
          />
        </GoogleMap>
      </div>
    );
  }
}

export default Map;
