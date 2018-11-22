import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFeaturedLocation } from '../../actions/locationActions';
import isEmpty from '../../validation/is-empty';
import FeaturedContent from './FeaturedContent';

// import styles
import {
  SidebarContainer,
  Header,
  ParkingFeed,
  ParkingCard,
  LocationList
} from './styled';

class Sidebar extends Component {
  constructor() {
    super();

    this.cardOnClick = this.cardOnClick.bind(this);
  }

  cardOnClick = (e, parking) => {
    e.preventDefault();
    this.props.setFeaturedLocation(parking);
  };

  render() {
    const { locations, featuredLocation } = this.props.locations;

    return (
      <SidebarContainer>
        {!isEmpty(featuredLocation) ? <FeaturedContent /> : null}

        <LocationList>
          <Header>
            <h3>Parking Locations</h3>
          </Header>

          <ParkingFeed>
            {locations.map(parking => (
              <a
                onClick={e => this.cardOnClick(e, parking)}
                href="#"
                key={parking._id}
              >
                <ParkingCard>
                  <div className="header">
                    <h5>{parking.name}</h5>
                  </div>
                  <div className="content">
                    <strong className="text-muted">ADDRESS</strong>
                    <p className="mb-0">
                      {parking.location.street}
                      <br />
                      {parking.location.postcode}
                    </p>
                  </div>
                </ParkingCard>
              </a>
            ))}
          </ParkingFeed>
        </LocationList>
      </SidebarContainer>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation }
)(Sidebar);
