import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking, setBookingData } from '../../actions/bookingActions';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class FeaturedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      selectedDays: []
    };

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    const { featuredLocation } = this.props.locations;

    this.props.setBookingData({
      location: featuredLocation,
      startDate: this.state.startDate
    });
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
  }

  onClose = e => {
    this.props.setFeaturedLocation();
  };

  render() {
    const featuredLocation = this.props.locations.featuredLocation.location;
    const { disabledDays } = this.props.locations.featuredLocation;
    const { selectedDays } = this.state;
    const today = new Date();

    // initiate an array of formatted dates
    const formattedDates = [];
    // map through unavailable dates and add them to an array
    disabledDays.map(date => formattedDates.push(new Date(date)));
    // formatted dates ready for putting into day picker
    formattedDates.push({ before: today });

    // create a formatted array of selected dates for the booking url
    let urlArray = [];
    // map through the selected days, format and push to urlArray
    selectedDays.map(day => urlArray.push(moment(day).format('DD-MM-YY')));
    // convert URL array into CSV
    let csvDays = urlArray.join(',');

    return (
      <div className="featured-content">
        <div className="header">
          <div className="top-content">
            <h3 className="heading">{featuredLocation.name}</h3>
            <button className="close-featured" onClick={this.onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="booking-data">
            <div className="spaces">
              <i className="fas fa-car" />
              <h5>
                <span>{featuredLocation.spaces}</span> spaces
              </h5>
            </div>

            <div className="pricing">
              <h4>
                <span>£</span>
                {(featuredLocation.price / 100).toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="featured-img">
            <img
              src="http://s0.geograph.org.uk/photos/14/66/146661_2c6e379d.jpg"
              alt=""
            />
          </div>

          <div className="inner-content">
            <div className="meta-data">
              <div className="address data">
                <label>
                  <i className="fas fa-map-marker-alt" /> Address
                </label>
                <p>
                  {featuredLocation.location.street},{' '}
                  {featuredLocation.location.postcode}
                </p>
              </div>

              <div className="road data">
                <label>
                  <i className="fas fa-road" /> En Route Roads
                </label>
                <p>{featuredLocation.roads}</p>
              </div>

              <div className="road data">
                <label>
                  <i className="fas fa-clock" /> Access Times
                </label>
                <p>{featuredLocation.accessTimes}</p>
              </div>
            </div>

            <div className="date-picker">
              <div className="section-header">
                <h2 className="heading">
                  <i className="fas fa-ticket-alt" /> Book Now
                </h2>
                <p>Greyed out dates are unfortunately unavailable.</p>
              </div>
              <DayPicker
                firstDayOfWeek={1}
                selectedDays={this.state.selectedDays}
                onDayClick={this.handleDayClick}
                disabledDays={formattedDates}
              />
              <br />
              <Link
                className="btn btn-green"
                to={`/booking/${featuredLocation._id}/?dates=${csvDays}`}
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
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
