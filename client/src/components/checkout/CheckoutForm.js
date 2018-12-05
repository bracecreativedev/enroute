import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking } from '../../actions/bookingActions';
import isEmpty from '../../validation/is-empty';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      paymentID: '',
      error: ''
    };

    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    const { parkingLocation, bookingDates } = this.props;
    const { user } = this.props.auth;

    ev.preventDefault();

    // create a stripe token
    this.props.stripe
      .createToken({ name: user.name })
      .then(({ token, error }) => {
        if (error) {
          // if there's an erorr, display error!
          this.setState({ error: error.message });
        } else {
          // create payment data
          const paymentData = {
            // attach the parking location
            location: parkingLocation._id,
            // attach the users id
            user: user.id,
            // array of booking dates
            bookingDates: bookingDates,
            // price is the amount of booking days * location price
            price: bookingDates.length * parkingLocation.price
          };

          axios.post('/api/payments', paymentData).then(res => {
            const chargeData = {
              token: token.id,
              price: bookingDates.length * parkingLocation.price,
              description: res.data._id
            };

            // charge account
            axios.post('/api/bookings/charge', chargeData);

            // add each date as an individual booking
            bookingDates.map(singleDate => {
              // add booking to the db
              return this.props.createBooking({
                user: user.id,
                location: parkingLocation._id,
                bookingDate: moment(singleDate, 'DD-MM-YY').toISOString(),
                price: parkingLocation.price,
                paymentRef: res.data._id
              });
            });

            // set state to complete
            this.setState({ complete: true, paymentID: res.data._id });
          });
        }
      });

    // setFeaturedLocation to empty (this is so it updates unavailble dates)
    this.props.setFeaturedLocation();
  }

  render() {
    const { error } = this.state;

    if (this.state.complete)
      return (
        <Redirect to={{ pathname: `/confirmation/${this.state.paymentID}` }} />
      );

    return (
      <div className="checkout-box">
        <p className="mb-1">Enter card details</p>
        <CardElement />
        {!isEmpty(error) ? <p>{error}</p> : null}
        <p className="stripe-text">
          Payments processed by <strong>Stripe</strong>
        </p>

        <div className="text-right">
          <button className="btn btn-white" onClick={this.submit}>
            Confirm Payment
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createBooking, setFeaturedLocation }
)(injectStripe(CheckoutForm));
