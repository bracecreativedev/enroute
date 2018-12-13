import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import { setFeaturedLocation } from '../../actions/locationActions';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import CheckoutForm from '../checkout/CheckoutForm';
import axios from 'axios';
import queryString from 'query-string';
import Moment from 'react-moment';
import moment from 'moment';
import isEmpty from '../../validation/is-empty';

class BookingDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDates: [],
      parkingLocation: {}
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;

    // grab parameters
    const dates = queryString.parse(this.props.location.search).dates;

    let selectedDates = [];

    // check if dates are empty
    if (!isEmpty(dates)) {
      selectedDates = dates.split(',');
    }

    let formattedDates = [];

    selectedDates.map(date => {
      return formattedDates.push(moment(date, 'DD-MM-YY').toISOString());
    });

    // get profile
    if (isAuthenticated) {
      this.props.getCurrentProfile();
    }

    this.setState({ selectedDates: formattedDates });

    const location = {
      _id: this.props.match.params.id
    };

    axios
      .get(`/api/locations/${location._id}`)
      .then(data => {
        this.props.setFeaturedLocation(data.data, isAuthenticated);
        this.setState({ parkingLocation: data.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { parkingLocation, selectedDates } = this.state;
    const { isAuthenticated } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const {
      alreadyBooked,
      disabledDays
    } = this.props.locations.featuredLocation;

    let checkoutContent;

    // if any of the dates for checkout have already been booked then return error
    if (!isEmpty(alreadyBooked)) {
      // combine alreadyBooked and disabledDays
      let unavailableDates = alreadyBooked.concat(disabledDays);

      // check to see if this array meets the orders parameters
      let found = selectedDates.some(date => unavailableDates.includes(date));
      let pastDays = false;

      // get today's date in ISO date form
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      selectedDates.map(date => {
        if (today.toISOString() > date) {
          return (pastDays = true);
        }
      });

      if (found || pastDays || isEmpty(selectedDates)) {
        return (checkoutContent = (
          <div className="page-container">
            <div className="container">
              <div className="generic-box">
                <div className="main-content">
                  <div className="header">
                    <h1 className="heading">Whoops, there's an issue here.</h1>
                    <p className="subheading">
                      One of the dates you've selected is not possible to book.
                      You may already have a booking on this day, the parking
                      location may be full or one of the days is in the past.
                    </p>
                  </div>

                  <div className="footer">
                    <Link to="/" className="btn btn-green">
                      &larr; Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ));
      }
    }

    if (isAuthenticated) {
      if (profile === null || loading) {
        checkoutContent = (
          <div className="page-container">
            <Spinner />
          </div>
        );
      } else {
        // Check if logged in user has profile data
        if (Object.keys(profile).length > 0) {
          checkoutContent = (
            <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
              <main className="page-container">
                <div className="container">
                  <div className="checkout">
                    <div className="row no-gutters">
                      <div className="col-xl-4 col-lg-12">
                        <div className="left-sidebar">
                          <div className="header">
                            <h5>Booking for</h5>
                            <h2 className="heading">{parkingLocation.name}</h2>
                            <h3 className="address">
                              {parkingLocation.location
                                ? parkingLocation.location.street +
                                  ', ' +
                                  parkingLocation.location.postcode
                                : null}
                            </h3>
                          </div>
                          <div className="location-content">
                            <div className="meta-data">
                              <p>
                                <i className="fas fa-clock" />{' '}
                                {parkingLocation.accessTimes}
                              </p>
                            </div>

                            <div className="meta-data">
                              <p>
                                <i className="fas fa-road" />{' '}
                                {parkingLocation.roads}
                              </p>
                            </div>

                            <div className="meta-data">
                              <p>
                                <i className="fas fa-info-circle" /> TODO
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-4 col-md-6">
                        <div className="main-content">
                          <div className="dates">
                            <div className="header">
                              <h2 className="heading">Dates</h2>
                            </div>

                            <div className="content">
                              <div className="row no-gutters">
                                {selectedDates.map(date => (
                                  <div
                                    className="col-lg-6 col-md-12"
                                    key={date}
                                  >
                                    <div className="single-date">
                                      <div className="date">
                                        <p>
                                          <Moment format="Do MMM YY">
                                            {date}
                                          </Moment>
                                        </p>
                                      </div>
                                      <div className="footer">
                                        <p>Cost</p>
                                        <p>
                                          £
                                          {(
                                            parkingLocation.price / 100
                                          ).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-4 col-md-6">
                        <div className="right-sidebar">
                          <div className="header">
                            <h2 className="heading">Total Price</h2>
                            <p className="price">
                              <span>£</span>
                              {(
                                (selectedDates.length * parkingLocation.price) /
                                100
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div className="footer">
                            <div className="vehicle-info">
                              <h3 className="heading">Your Vehicle</h3>
                              <p>
                                <span>Reg</span> {profile.vehicle.reg}
                              </p>

                              {profile.vehicle.make ? (
                                <p>
                                  <span>Make</span> {profile.vehicle.make}
                                </p>
                              ) : null}

                              {profile.vehicle.model ? (
                                <p>
                                  <span>Model</span> {profile.vehicle.model}
                                </p>
                              ) : null}

                              {profile.vehicle.colour ? (
                                <p>
                                  <span>Model</span> {profile.vehicle.colour}
                                </p>
                              ) : null}

                              <p className="edit-profile">
                                Incorrect vehicle?{' '}
                                <Link to="/edit-profile">
                                  Update your profile
                                </Link>
                                .
                              </p>
                            </div>

                            <Elements>
                              <CheckoutForm
                                parkingLocation={parkingLocation}
                                selectedDates={selectedDates}
                              />
                            </Elements>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </StripeProvider>
          );
        } else {
          this.props.history.push('/create-profile');
        }
      }
    }

    return <div>{checkoutContent}</div>;
  }
}

const mapStateToProps = state => ({
  locations: state.locations,
  bookings: state.bookings,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, setFeaturedLocation }
)(BookingDetails);
