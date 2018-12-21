import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllPayments } from '../../actions/paymentActions';
import isEmpty from '../../validation/is-empty';
import Spinner from '../common/Spinner';
import PaymentCard from './PaymentCard';

class Payments extends Component {
  componentDidMount() {
    this.props.getAllPayments();

    document.title = 'Payments - En Route Parking';
  }

  render() {
    const { payments, loading } = this.props.payments;

    let paymentsContent;

    if (loading) {
      paymentsContent = (
        <div>
          <Spinner />
        </div>
      );
    } else if (isEmpty(payments)) {
      paymentsContent = (
        <div className="container">
          <div className="payments-box">
            <div className="header">
              <h1 className="heading mb-3 mb-sm-0">
                You have no past payments, every payment you make will appear
                here in the future!
              </h1>
            </div>

            <div className="footer text-left">
              <Link to="/" className="btn btn-green">
                &larr; Home
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      paymentsContent = (
        <div className="container">
          <div className="payments-box">
            <div className="header">
              <h1 className="heading">Your past payments</h1>
              <Link to="/bookings" className="btn btn-green">
                View Bookings &rarr;
              </Link>
            </div>
            <div className="main-content">
              <div className="row">
                {payments.map(payment => (
                  <div className="col-md-6 col-lg-4" key={payment._id}>
                    <PaymentCard payment={payment} />
                  </div>
                ))}
              </div>
            </div>

            <div className="footer">
              <Link to="/bookings" className="btn btn-green">
                View Bookings &rarr;
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return <main className="page-container">{paymentsContent}</main>;
  }
}

const mapStateToProps = state => ({
  payments: state.payments
});

export default connect(
  mapStateToProps,
  { getAllPayments }
)(Payments);
