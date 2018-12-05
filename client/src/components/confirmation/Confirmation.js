import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPayment } from '../../actions/paymentActions';
import Spinner from '../common/Spinner';
import isEmpty from '../../validation/is-empty';
import moment from 'moment';
import Moment from 'react-moment';

class Confirmation extends Component {
  componentDidMount() {
    this.props.getPayment(this.props.match.params.id);
  }

  render() {
    const { payment, loading } = this.props.payments;

    let confirmationContent;

    if (loading) {
      confirmationContent = (
        <div>
          <Spinner />
        </div>
      );
    } else if (isEmpty(payment)) {
      confirmationContent = (
        <div className="confirmation-box">
          <div className="main-content">
            <div className="header" style={{ border: 'none' }}>
              <h1 className="heading">Oops, something went wrong.</h1>
              <p>The payment either can't be found or doesn't belong to you!</p>
            </div>
          </div>

          <div className="footer">
            <Link to="/" className="btn btn-green">
              &larr; Home
            </Link>
          </div>
        </div>
      );
    } else {
      confirmationContent = (
        <div class="confirmation-box">
          <div class="main-content">
            <div class="header">
              <h1 class="heading">Thank you for your payment!</h1>
              <p>The following is your payment and booking confirmation.</p>
            </div>

            <div class="payment-details">
              <div class="meta-section">
                <h2>Payment Reference</h2>
                <p>{payment._id}</p>
              </div>
              <div class="meta-section">
                <h2>Parking Location</h2>
                <p class="mb-0">
                  <strong>{payment.location.name}</strong>
                </p>
                <p>
                  {payment.location.location.street},{' '}
                  {payment.location.location.postcode}
                </p>
              </div>

              <div class="meta-section">
                <h2>Dates</h2>
                <ul>
                  {payment.bookingDates.map(date => (
                    <li key={date}>
                      <Moment format="dddd Do MMMM YY">
                        {moment(date, 'DD-MM-YY')}
                      </Moment>
                    </li>
                  ))}
                </ul>
              </div>

              <div class="meta-section">
                <h2>Total Paid</h2>
                <p>£{(payment.price / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <Link to="/" class="btn btn-green">
              &larr; Home
            </Link>
            <Link to="/bookings" class="btn btn-green">
              View your bookings
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">{confirmationContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  payments: state.payments
});

export default connect(
  mapStateToProps,
  { getPayment }
)(Confirmation);