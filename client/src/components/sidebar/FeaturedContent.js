import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFeaturedLocation } from '../../actions/locationActions';

// import styles
import { FeaturedContentContainer, Header } from './styled';

class FeaturedContent extends Component {
  onClick = e => {
    this.props.setFeaturedLocation();
  };

  render() {
    const { featuredLocation } = this.props.locations;

    return (
      <FeaturedContentContainer>
        <Header>
          <h3>{featuredLocation.name}</h3>

          <button onClick={this.onClick}>
            <i className="fas fa-times" />
          </button>
        </Header>

        <div className="content">
          <strong className="text-muted">ADDRESS</strong>
          <p>
            {featuredLocation.location.street}
            <br />
            {featuredLocation.location.postcode}
          </p>
        </div>
      </FeaturedContentContainer>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation }
)(FeaturedContent);
