import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import {
  adminGetLocations,
  adminGetBookings
} from '../../actions/adminActions';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import TextFieldGroupHover from '../common/TextFieldGroupHover';

class AdminBookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLocation: '',
      bookingDates: 'all',
      user: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.locationChange = this.locationChange.bind(this);
    this.getBookings = this.getBookings.bind(this);
    this.dateFilterChange = this.dateFilterChange.bind(this);
  }

  componentDidMount() {
    this.props.adminGetLocations();

    let queries = {
      location: this.state.selectedLocation,
      bookingDates: this.state.bookingDates,
      user: this.state.user
    };

    this.props.adminGetBookings(queries);
  }

  locationChange(e) {
    this.setState({ selectedLocation: e.target.value });
  }

  dateFilterChange(e) {
    this.setState({ bookingDates: e.target.value });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getBookings(e) {
    let queries = {
      location: this.state.selectedLocation,
      bookingDates: this.state.bookingDates,
      user: this.state.user
    };

    this.props.adminGetBookings(queries);
  }

  render() {
    const { locations, bookings } = this.props.admin;
    const { errors } = this.state;

    const csvHeaders = [
      { label: 'Booking ID', key: '_id' },
      { label: 'Booking Date', key: 'bookingDate' },
      { label: 'Payment Date', key: 'date' },
      { label: 'Payment ID', key: 'paymentRef' },
      { label: 'Location', key: 'location.name' },
      { label: 'User ID', key: 'user._id' },
      { label: 'User Name', key: 'user.name' },
      { label: 'User Email', key: 'user.email' },
      { label: 'Price', key: 'price' },
      { label: 'Vehicle Reg', key: 'vehicle.reg' },
      { label: 'Vehicle Make', key: 'vehicle.make' },
      { label: 'Vehicle Model', key: 'vehicle.model' },
      { label: 'Vehicle Colour', key: 'vehicle.colour' }
    ];

    return (
      <div className="page-container">
        <div className="container">
          <div className="bookings-box">
            <div className="main-content">
              <div className="header d-block">
                <h1 className="heading">Manage Bookings</h1>

                <div className="filters">
                  <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">
                      Select Location
                    </label>
                    <select
                      className="form-control"
                      onChange={this.locationChange}
                      id="exampleFormControlSelect1"
                    >
                      <option value="">All</option>
                      {locations.map(location => {
                        return (
                          <option key={location._id} value={location._id}>
                            {location.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleFormControlSelect1">
                      Booking Dates
                    </label>
                    <select
                      className="form-control"
                      onChange={this.dateFilterChange}
                      id="exampleFormControlSelect1"
                    >
                      <option value="all">All</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <form
                    style={{ marginBottom: '20px' }}
                    className="form-label form-css-label"
                    noValidate
                  >
                    <TextFieldGroupHover
                      label="User ID"
                      name="user"
                      type="text"
                      value={this.state.user}
                      onChange={this.onChange}
                      error={errors.user}
                    />
                  </form>
                  <button className="btn btn-green" onClick={this.getBookings}>
                    Search
                  </button>
                </div>
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Location</th>
                    <th>User</th>
                    <th>Booking Date</th>
                    <th>Purchase Date</th>
                    <th>Reg</th>
                    <th>Payment Ref</th>
                  </tr>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.location.name}</td>
                      <td title={booking.user._id}>{booking.user.name}</td>
                      <td>
                        <Moment format="ddd Do MMM YYYY">
                          {booking.bookingDate}
                        </Moment>
                      </td>
                      <td>
                        <Moment format="ddd Do MMM YYYY">{booking.date}</Moment>
                      </td>
                      <td>{booking.vehicle.reg}</td>
                      <td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="footer">
                <CSVLink
                  data={bookings}
                  headers={csvHeaders}
                  className="btn btn-green"
                  filename={'bookings-en-route-booking.csv'}
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.admin
});

export default connect(
  mapStateToProps,
  { adminGetLocations, adminGetBookings }
)(AdminBookings);
