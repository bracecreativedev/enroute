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
  }

  render() {
    const { payments, loading } = this.props.payments;

    let paymentsContent;

    if (isEmpty(payments) || loading) {
      paymentsContent = (
        <div>
          <Spinner />
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
