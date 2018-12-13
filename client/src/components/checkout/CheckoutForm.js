import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements';
import axios from 'axios';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking } from '../../actions/bookingActions';
import isEmpty from '../../validation/is-empty';
import { Redirect } from 'react-router-dom';
import SpinnerLight from '../../components/common/SpinnerLight';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      paymentID: '',
      paymentLoading: '',
      error: ''
    };

    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    const { parkingLocation, selectedDates } = this.props;
    const { user } = this.props.auth;

    ev.preventDefault();

    // create a stripe token
    this.props.stripe
      .createToken({ name: user.name })
      .then(({ token, error }) => {
        if (error) {
          // if there's an erorr, display error!
          this.setState({ error: error.message });
          console.log(this.state.paymentLoading);
        } else {
          this.setState({ paymentLoading: true });

          const paymentData = {
            bookingDates: selectedDates,
            token: token.id
          };

          axios
            .post(`/api/payments/new/${parkingLocation._id}`, paymentData)
            .then(res => {
              console.log('payment success');
              this.setState({
                complete: true,
                paymentID: res.data._id,
                paymentLoading: false
              });
            })
            .catch(err => {
              this.setState({ error: err, paymentLoading: false });
              console.log(this.state.error);
            });
        }
      });

    // setFeaturedLocation to empty (this is so it updates unavailble dates)
    this.props.setFeaturedLocation();
  }

  render() {
    const { error, paymentLoading } = this.state;

    if (this.state.complete)
      return (
        <Redirect to={{ pathname: `/confirmation/${this.state.paymentID}` }} />
      );

    let checkoutFormContent;

    if (paymentLoading) {
      checkoutFormContent = (
        <div className="checkout-box">
          <SpinnerLight />
        </div>
      );
    } else {
      checkoutFormContent = (
        <div className="checkout-box">
          <p className="mb-1">Enter your card details</p>
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

    return <span>{checkoutFormContent}</span>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createBooking, setFeaturedLocation }
)(injectStripe(CheckoutForm));
