import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFeaturedLocation } from '../../actions/locationActions';
import isEmpty from '../../validation/is-empty';
import FeaturedContent from './FeaturedContent';
import Spinner from '../common/Spinner';

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
    let sidebarContent;

    if (isEmpty(locations)) {
      sidebarContent = (
        <div className="sidebar">
          <Spinner />
        </div>
      );
    } else {
      sidebarContent = (
        <div>
          <div className="sidebar">
            <div className="header">Hello world</div>

            <div className="location-list">
              {locations.map(parking => (
                <button
                  onClick={e => this.cardOnClick(e, parking)}
                  key={parking._id}
                  style={{ width: '100%' }}
                >
                  <div className="single-location">
                    <div className="single-header">
                      <h3 className="heading">{parking.name}</h3>
                      <h4 className="address">
                        {parking.location.street}, {parking.location.postcode}
                      </h4>
                    </div>

                    <div className="main-content">
                      <div className="meta-data">
                        <div className="service roads">
                          <i className="fas fa-road" />
                          <h5>{parking.roads}</h5>
                        </div>

                        <div className="service times">
                          <i className="fas fa-clock" />
                          <h5>{parking.accessTimes}</h5>
                        </div>
                      </div>

                      <div className="booking-data">
                        <div className="spaces">
                          <i className="fas fa-car" />
                          <h5>
                            <span>{parking.spaces}</span> spaces
                          </h5>
                        </div>

                        <div className="pricing">
                          <h4>
                            <span>£</span>
                            {(parking.price / 100).toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {!isEmpty(featuredLocation) ? <FeaturedContent /> : null}
        </div>
      );
    }

    return <div>{sidebarContent}</div>;
  }
}

const mapStateToProps = state => ({
  locations: state.locations
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation }
)(Sidebar);
