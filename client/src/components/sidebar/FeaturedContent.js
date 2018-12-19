import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking, setBookingData } from '../../actions/bookingActions';
import isEmpty from '../../validation/is-empty';
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
    document.body.classList.add('noscroll');
    const { featuredLocation } = this.props.locations;

    this.props.setBookingData({
      location: featuredLocation,
      startDate: this.state.startDate
    });
  }

  componentWillUnmount() {
    document.body.classList.remove('noscroll');
  }

  handleDayClick(day, modifiers = {}) {
    const { selectedDays } = this.state;

    if (modifiers.disabled) {
      return;
    }

    if (modifiers.selected) {
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
    const {
      disabledDays,
      alreadyBooked
    } = this.props.locations.featuredLocation;
    const { selectedDays } = this.state;
    const today = new Date();

    // initiate an array of formatted dates
    const formattedDates = [];
    // map through unavailable dates and add them to an array
    disabledDays.map(date => formattedDates.push(new Date(date)));
    if (!isEmpty(alreadyBooked)) {
      alreadyBooked.map(bookedDate =>
        formattedDates.push(new Date(bookedDate))
      );
    }
    // formatted dates ready for putting into day picker

    // block out dates before today
    formattedDates.push({ before: today });

    // disabled days after 'disabledAfter' date
    if (!isEmpty(featuredLocation.disabledAfter)) {
      formattedDates.push({ after: new Date(featuredLocation.disabledAfter) });
    }

    // block out dates inside the 'date-range' array
    if (featuredLocation.disabledRange) {
      featuredLocation.disabledRange.map(range => {
        return formattedDates.push({
          from: new Date(range.disabledFrom),
          to: new Date(range.disabledTo)
        });
      });
    }

    // push days of week that are unavailable
    let daysOfWeek = [];
    if (featuredLocation.disabledDaysOfWeek) {
      featuredLocation.disabledDaysOfWeek.map(day => {
        return daysOfWeek.push(day.dayNumber);
      });
    }
    formattedDates.push({ daysOfWeek });

    // map through disabledSingleDays
    if (featuredLocation.disabledSingleDays) {
      featuredLocation.disabledSingleDays.map(date => {
        return formattedDates.push(new Date(date.date));
      });
    }

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
          {!isEmpty(featuredLocation.images) ? (
            <div
              id="featuredImages"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {featuredLocation.images.map((image, index) => {
                  return (
                    <div
                      className={
                        index === 0 ? 'carousel-item active' : 'carousel-item'
                      }
                      key={image.imageURL}
                    >
                      <img
                        className="d-block w-100"
                        src={image.imageURL}
                        alt="First slide"
                      />
                    </div>
                  );
                })}
              </div>
              <a
                className="carousel-control-prev"
                href="#featuredImages"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#featuredImages"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </a>
            </div>
          ) : null}

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
                to={`/checkout/${featuredLocation._id}?dates=${csvDays}`}
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
  locations: state.locations,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation, createBooking, setBookingData }
)(FeaturedContent);
