import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBookings } from '../../actions/bookingActions';
import Spinner from '../common/Spinner';
import isEmpty from '../../validation/is-empty';
import Moment from 'react-moment';

class Bookings extends Component {
  componentDidMount() {
    this.props.getBookings();
  }

  render() {
    const { bookings, loading } = this.props.bookings;

    let bookingsContent;

    if (bookings == null || loading) {
      bookingsContent = <Spinner />;
    } else {
      if (isEmpty(bookings)) {
        bookingsContent = (
          <div>
            <h1>
              You have no past bookings, all future bookings will appear here!
            </h1>
          </div>
        );
      } else {
        bookingsContent = (
          <div>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th>LOCATION</th>
                  <th>DATE</th>
                  <th>PURCHASE DATE</th>
                  <th>PRICE</th>
                  <th>PAYMENT REF</th>
                </tr>

                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.location.name}</td>
                    <td>
                      <Moment format="ddd Do MMM YYYY">
                        {booking.bookingDate}
                      </Moment>
                    </td>
                    <td>
                      <Moment format="ddd Do MMM YYYY">{booking.date}</Moment>
                    </td>
                    <td>£{(booking.price / 100).toFixed(2)}</td>
                    <td>{booking.paymentRef ? booking.paymentRef : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    return (
      <div className="page-container">
        <div className="container">
          <div className="text-center">{bookingsContent}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bookings: state.bookings
});

export default connect(
  mapStateToProps,
  { getBookings }
)(Bookings);
