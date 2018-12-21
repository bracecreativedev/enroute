import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUpcomingBookings } from '../../actions/bookingActions';
import queryString from 'query-string';
import Spinner from '../common/Spinner';
import isEmpty from '../../validation/is-empty';
import Moment from 'react-moment';

class Bookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: parseInt(queryString.parse(this.props.location.search).page || 1)
    };
  }

  componentDidMount() {
    document.title = 'Upcoming Bookings - En Route Parking';

    this.props.getUpcomingBookings(this.state.page);
  }

  render() {
    const { loading } = this.props.bookings;
    const bookings = this.props.bookings.upcomingBookings;
    const { page } = this.state;

    let bookingsContent;

    if (bookings.docs == null || loading) {
      bookingsContent = <Spinner />;
    } else {
      if (isEmpty(bookings.docs)) {
        bookingsContent = (
          <div className="bookings-box">
            <div className="main-content">
              <div className="header">
                <h1 className="heading">
                  You have no upcoming bookings, all future bookings will appear
                  here!
                </h1>
              </div>

              <div className="footer">
                <Link
                  to="/"
                  className="btn btn-green"
                  style={{ marginRight: '30px' }}
                >
                  &larr; Home
                </Link>

                <Link to="/past-bookings" className="btn btn-green">
                  Past Bookings
                </Link>
              </div>
            </div>
          </div>
        );
      } else {
        bookingsContent = (
          <div className="bookings-box">
            <div className="main-content">
              <div className="header">
                <h1 className="heading">Your upcoming bookings</h1>
                <Link to="/past-bookings" className="btn btn-green">
                  Past Bookings
                </Link>
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Location</th>
                    <th>Booking Date</th>
                    <th>Purchase Date</th>
                    <th>Reg</th>
                    <th>Payment Ref</th>
                  </tr>
                  {bookings.docs.map(booking => (
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
                      <td>{booking.vehicle ? booking.vehicle.reg : '-'}</td>
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

              {bookings.totalPages === 1 ? null : (
                <div className="pagination">
                  <p className="w-100 text-center">
                    {page > 1 ? (
                      <Link
                        style={{ marginRight: '10px' }}
                        onClick={this.forceUpdate}
                        to={{
                          pathname: `/bookings?page=${page - 1}`
                        }}
                      >
                        <span className="badge badge-green">
                          &larr; Prev Page
                        </span>
                      </Link>
                    ) : null}
                    Page {page}
                    {page < bookings.totalPages ? (
                      <Link
                        style={{ marginLeft: '10px' }}
                        onClick={this.forceUpdate}
                        to={{
                          pathname: `/bookings?page=${page + 1}`
                        }}
                      >
                        <span className="badge badge-green">
                          Next Page &rarr;
                        </span>
                      </Link>
                    ) : null}
                  </p>
                </div>
              )}

              <div className="footer text-right">
                <Link to="/payments" className="btn btn-green">
                  View Payments
                </Link>
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
  { getUpcomingBookings }
)(Bookings);
