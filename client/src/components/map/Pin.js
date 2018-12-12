import React, { Component } from 'react';
import { connect } from 'react-redux';
import pin from './enroute-pin.png';
import { setFeaturedLocation } from '../../actions/locationActions';
import isEmpty from '../../validation/is-empty';

class Pin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pinClass: ''
    };
  }

  onPinClick = e => {
    const { active } = this.state;
    const { location } = this.props;

    e.preventDefault();

    if (active) {
      this.setState({ active: false });
    } else {
      this.setState({ active: true });
    }

    this.props.setFeaturedLocation(location);
  };

  render() {
    const { location, featuredLocation } = this.props;

    const pinStyle = {
      width: '50px',
      height: '50px'
      // transform: 'translate(-50%, -50%)'
    };

    const pinStyleActive = {
      width: '70px',
      height: '70px'
    };

    // if pin is active, change the pin styles!
    let pinImage, activePin;
    if (
      !isEmpty(featuredLocation.location) &&
      featuredLocation.location._id === location._id
    ) {
      pinImage = <img src={pin} alt="" style={pinStyleActive} />;
      activePin = true;
    } else {
      pinImage = <img src={pin} alt="" style={pinStyle} />;
      activePin = false;
    }

    return (
      <div className={activePin ? 'pin-container active' : 'pin-container'}>
        <div className="pin-hover">
          <div className="content">
            <p>
              <strong>{location.name}</strong>
            </p>
          </div>
          <div className="footer">
            <p>Cost</p>
            <p className="price">£{(location.price / 100).toFixed(2)}</p>
          </div>
        </div>

        <button
          style={{ background: 'none', border: 'none', padding: 'none' }}
          onClick={this.onPinClick}
        >
          {pinImage}
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation }
)(Pin);
