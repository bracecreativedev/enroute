import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';
import CheckoutForm from '../checkout/CheckoutForm';
import axios from 'axios';
import queryString from 'query-string';
import Moment from 'react-moment';
import moment from 'moment';

class BookingDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingDates: [],
      parkingLocation: {}
    };
  }

  componentDidMount() {
    // grab parameters
    const dates = queryString.parse(this.props.location.search).dates;
    let bookingDates = dates.split(',');

    this.setState({ bookingDates: bookingDates });

    const locationID = this.props.match.params.id;

    axios
      .get(`/api/locations/${locationID}`)
      .then(data => this.setState({ parkingLocation: data.data }));
  }

  render() {
    const { parkingLocation, bookingDates } = this.state;

    return (
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
                          <i className="fas fa-road" /> {parkingLocation.roads}
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
                          {bookingDates.map(date => (
                            <div className="col-lg-6 col-md-12" key={date}>
                              <div className="single-date">
                                <div className="date">
                                  <p>
                                    <Moment format="Do MMM YY">
                                      {moment(date, 'DD-MM-YY')}
                                    </Moment>
                                  </p>
                                </div>
                                <div className="footer">
                                  <p>Cost</p>
                                  <p>
                                    £{(parkingLocation.price / 100).toFixed(2)}
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
                          (bookingDates.length * parkingLocation.price) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div className="footer">
                      <Elements>
                        <CheckoutForm
                          parkingLocation={parkingLocation}
                          bookingDates={bookingDates}
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
  }
}

const mapStateToProps = state => ({
  locations: state.locations,
  bookings: state.bookings
});

export default connect(mapStateToProps)(BookingDetails);
