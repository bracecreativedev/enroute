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
      date: '',
      parkingLocation: {}
    };
  }
  componentDidMount() {
    // grab parameters
    const values = queryString.parse(this.props.location.search);
    this.setState({ date: values.date });

    const locationID = this.props.match.params.id;

    axios
      .get(`/api/locations/${locationID}`)
      .then(data => this.setState({ parkingLocation: data.data }));
  }

  render() {
    const { parkingLocation, date } = this.state;

    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <div className="container">
          <div className="example">
            <h1>Book your parking</h1>
            <p>Location: {parkingLocation.name}</p>
            <p>Date: {date}</p>
            <p>Price: £{(parkingLocation.price / 100).toFixed(2)}</p>
            <Elements>
              <CheckoutForm parkingLocation={parkingLocation} date={date} />
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
