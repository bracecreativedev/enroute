import React, { Component } from 'react';
import { connect } from 'react-redux';
import pin from './enroute-pin.png';
import styled from 'styled-components';
import { setFeaturedLocation } from '../../actions/locationActions';
import isEmpty from '../../validation/is-empty';

const PinHover = styled.div`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  background: #5bc6f2;
  color: white;
  top: -5px;
  transform: translate(-35%, -100%);
  width: 200px;
  border-radius: 2px;
  padding: 10px;
  text-align: left;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  p {
    margin-bottom: 0;
  }
`;

const PinContainer = styled.div`
  position: relative;
  transform: translate(-50%, -50%);

  button {
    transform: translate(-60%, -50%);

    &:hover {
      cursor: pointer;

      ${PinHover} {
        opacity: 1;
        z-index: 20;
      }
    }

    &:focus {
      outline: none;

      ${PinHover} {
        opacity: 1;
        z-index: -1;
      }
    }
  }
`;

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
    let pinImage;
    if (!isEmpty(featuredLocation) && featuredLocation._id === location._id) {
      pinImage = <img src={pin} alt="" style={pinStyleActive} />;
    } else {
      pinImage = <img src={pin} alt="" style={pinStyle} />;
    }

    return (
      <PinContainer>
        <button
          style={{ background: 'none', border: 'none', padding: 'none' }}
          onClick={this.onPinClick}
        >
          <PinHover>
            <p>
              <strong>{location.name}</strong>
            </p>
            <p>{location.location.street}</p>
            <p>{location.location.postcode}</p>
          </PinHover>

          {pinImage}
        </button>
      </PinContainer>
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
