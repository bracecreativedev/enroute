import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { createBooking } from '../../actions/bookingActions';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    const { parkingLocation, date } = this.props;
    const { user } = this.props.auth;

    ev.preventDefault();

    this.props.stripe
      .createToken({ name: user.name })
      .then(({ token, error }) => {
        if (error) {
          console.log(error);
        } else {
          const chargeData = {
            token: token.id,
            price: 300,
            description: parkingLocation.name + ' - ' + date + ' - ' + user.name
          };

          // charge account
          axios.post('/api/bookings/charge', chargeData);

          // add booking to the db
          this.props.createBooking({
            user: user.id,
            location: parkingLocation._id,
            bookingDate: date
          });

          // set state to complete
          this.setState({ complete: true });
        }
      });
  }

  render() {
    if (this.state.complete) return <h1>Purchase Complete</h1>;

    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
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
