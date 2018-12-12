import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const PaymentCard = ({ payment }) => {
  return (
    <div className="payment-card">
      {/* <!-- card header --> */}
      <div className="payment-header">
        <h3 className="date">
          <Moment format="Do MMM YYYY">{payment.date}</Moment>
        </h3>
        <div className="status">
          <span className="badge badge-green">Paid</span>
        </div>
      </div>

      {/* <!-- card main content --> */}
      <div className="payment-content">
        <h2 className="location" title={payment.location.name}>
          {payment.location.name}
        </h2>
        <div className="price">
          <p>GBP £{(payment.price / 100).toFixed(2)}</p>
        </div>
        <div className="dates">
          {payment.bookingDates.length > 1 ? (
            <p>{payment.bookingDates.length} dates booked.</p>
          ) : (
            <p>{payment.bookingDates.length} date booked.</p>
          )}
        </div>
      </div>

      {/* <!-- card footer --> */}
      <div className="footer">
        <Link to={{ pathname: `/confirmation/${payment._id}` }}>
          View Payment <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCard;
