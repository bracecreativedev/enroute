import React, { Component } from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';
import CheckoutForm from '../checkout/CheckoutForm';
import axios from 'axios';
import queryString from 'query-string';

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
        <div className="container">
          <div className="example">
            <h1>Book your parking</h1>
            <p>Location: {parkingLocation.name}</p>
            <p>Date: </p>
            <ul>
              {bookingDates.map(date => (
                <li key={date}>{date}</li>
              ))}
            </ul>

            <p>
              Price: £
              {((parkingLocation.price / 100) * bookingDates.length).toFixed(2)}
            </p>
            <Elements>
              <CheckoutForm
                parkingLocation={parkingLocation}
                bookingDates={bookingDates}
              />
            </Elements>
          </div>
        </div>
      </StripeProvider>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations,
  bookings: state.bookings
});

export default connect(mapStateToProps)(BookingDetails);
