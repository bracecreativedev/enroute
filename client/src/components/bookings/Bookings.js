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
            {bookings.map(booking => (
              <div className="card my-3" key={booking._id}>
                <h1>{booking.location.name}</h1>
                <p>
                  <strong>Date:</strong>{' '}
                  <Moment format="ddd MMMM Do YYYY">
                    {booking.bookingDate}
                  </Moment>
                </p>
                <p>
                  <strong>Purchased:</strong>{' '}
                  <Moment format="ddd MMMM Do YYYY">{booking.date}</Moment>
                </p>
              </div>
            ))}
          </div>
        );
      }
    }

    return (
      <div>
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
