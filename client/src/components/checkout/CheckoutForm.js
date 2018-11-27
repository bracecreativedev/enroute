import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { createBooking } from '../../actions/bookingActions';
import isEmpty from '../../validation/is-empty';
import moment from 'moment';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = { complete: false, error: '' };
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
              this.props.createBooking({
                user: user.id,
                location: parkingLocation._id,
                bookingDate: moment(singleDate, 'DD-MM-YY').toISOString(),
                price: parkingLocation.price
              });

              console.log(
                'Booking added with date: ' +
                  moment(singleDate, 'DD-MM-YY').toISOString()
              );
            });
          });

          // set state to complete
          this.setState({ complete: true });
        }
      });
  }

  render() {
    const { error } = this.state;

    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        {!isEmpty(error) ? <p>{error}</p> : null}

        <button onClick={this.submit}>Send</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createBooking }
)(injectStripe(CheckoutForm));
