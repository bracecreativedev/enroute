import React, { Component } from 'react';
import { connect } from 'react-redux';
import pin from './home-pin.png';
import { setFeaturedLocation } from '../../actions/locationActions';
import isEmpty from '../../validation/is-empty';

class UserPin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
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
    const { profile } = this.props;

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
    let pinImage;
    if (!isEmpty(featuredLocation) && featuredLocation._id === location._id) {
      pinImage = <img src={pin} alt="" style={pinStyleActive} />;
    } else {
      pinImage = <img src={pin} alt="" style={pinStyle} />;
    }

    return (
      <div className="pin-container">
        <div className="pin-hover home">
          <div className="content">
            <p>
              <strong>Home Address</strong>
            </p>
          </div>
          <div className="footer justify-content-center">
            <p className="price">{profile.address.postcode}</p>
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

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { setFeaturedLocation }
)(UserPin);
