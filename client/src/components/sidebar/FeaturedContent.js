import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking, setBookingData } from '../../actions/bookingActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

// import styles
import { FeaturedContentContainer, Header } from './styled';

class FeaturedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date()
    };

    this.handleChange = this.handleChange.bind(this);
    // this.newBooking = this.newBooking.bind(this);
  }

  componentDidMount() {
    const { featuredLocation } = this.props.locations;

    this.props.setBookingData({
      location: featuredLocation,
      startDate: this.state.startDate
    });
  }

  handleChange(date) {
    const { featuredLocation } = this.props.locations;

    this.setState({
      startDate: date
    });

    this.props.setBookingData({
      location: featuredLocation,
      startDate: date
    });
  }

  onClick = e => {
    this.props.setFeaturedLocation();
  };

  // newBooking(e) {
  //   e.preventDefault();

  //   const { featuredLocation } = this.props.locations;

  //   const bookingData = {
  //     location: featuredLocation._id,
  //     bookingDate: this.state.startDate
  //   };

  //   this.props.setFeaturedLocation({
  //     featuredLocation,
  //     date: this.state.startDate
  //   });

  //   this.props.createBooking(bookingData);
  // }

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

          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
          />
          <br />
          <Link
            to={`/booking/${featuredLocation._id}/?date=${moment(
              this.state.startDate
            ).format('YYYY-MM-DD')}`}
          >
            BOOK NOW
          </Link>
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
  { setFeaturedLocation, createBooking, setBookingData }
)(FeaturedContent);
