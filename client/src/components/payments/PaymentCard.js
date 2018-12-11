import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const PaymentCard = ({ payment }) => {
  return (
    <div class="payment-card">
      {/* <!-- card header --> */}
      <div class="payment-header">
        <h3 class="date">
          <Moment format="Do MMM YYYY">{payment.date}</Moment>
        </h3>
        <div class="status">
          <span class="badge badge-green">Paid</span>
        </div>
      </div>

      {/* <!-- card main content --> */}
      <div class="payment-content">
        <h2 class="location" title={payment.location.name}>
          {payment.location.name}
        </h2>
        <div class="price">
          <p>GBP £{(payment.price / 100).toFixed(2)}</p>
        </div>
        <div class="dates">
          {payment.bookingDates.length > 1 ? (
            <p>{payment.bookingDates.length} dates booked.</p>
          ) : (
            <p>{payment.bookingDates.length} date booked.</p>
          )}
        </div>
      </div>

      {/* <!-- card footer --> */}
      <div class="footer">
        <Link to={{ pathname: `/confirmation/${payment._id}` }}>
          View Payment <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCard;
