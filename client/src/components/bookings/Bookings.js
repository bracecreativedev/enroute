import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
          <div className="bookings-box">
            <div className="main-content">
              <div className="header">
                <h1 className="heading mb-3 mb-sm-0">Bookings</h1>
                <a href="#" className="btn btn-green">
                  View Invoices
                </a>
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Location</th>
                    <th>Booking Date</th>
                    <th>Purchase Date</th>
                    <th>Reg</th>
                    <th>Invoice</th>
                  </tr>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.location.name}</td>
                      <td>
                        <span className="d-md-none">
                          <Moment format="DD-MM-YY">
                            {booking.bookingDate}
                          </Moment>
                        </span>
                        <span className="d-none d-md-block">
                          <Moment format="ddd Do MMM YYYY">
                            {booking.bookingDate}
                          </Moment>
                        </span>
                      </td>
                      <td>
                        <Moment format="ddd Do MMM YYYY">{booking.date}</Moment>
                      </td>
                      <td>£{(booking.price / 100).toFixed(2)}</td>
                      <td>
                        {booking.paymentRef ? (
                          <Link
                            to={{
                              pathname: `/confirmation/${booking.paymentRef}`
                            }}
                          >
                            <span className="badge badge-green">
                              View{' '}
                              <span className="d-none d-md-inline-block">
                                Payment
                              </span>
                            </span>
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="footer text-right">
                <a href="#" className="btn btn-green">
                  View Invoices
                </a>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="page-container">
        <div className="container">{bookingsContent}</div>
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
