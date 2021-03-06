import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import TextFieldGroupHover from '../common/TextFieldGroupHover';
import { adminGetPayments } from '../../actions/adminActions';
import Moment from 'react-moment';

class AdminPayments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {}
    };
  }

  componentDidMount() {
    this.props.adminGetPayments();
  }

  render() {
    // const { errors } = this.state;
    const { payments } = this.props.admin;

    const csvHeaders = [
      { label: 'Payment ID', key: '_id' },
      { label: 'Payment Date', key: 'date' },
      { label: 'User ID', key: 'user._id' },
      { label: 'User Name', key: 'user.name' },
      { label: 'User Email', key: 'user.email' },
      { label: 'Location ID', key: 'location._id' },
      { label: 'Location Name', key: 'location.name' },
      { label: 'Booking Dates', key: 'bookingDates' },
      { label: 'Total Price', key: 'price' },
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
                <h1 className="heading">Manage Payments</h1>

                {/* <div className="filters">
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
                </div> */}
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Location</th>
                    <th>Payment ID</th>
                    <th>User</th>
                    <th>Dates</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>View</th>
                  </tr>
                  {payments.map(payment => {
                    return (
                      <tr key={payment._id}>
                        <td>{payment.location.name}</td>
                        <td>{payment._id}</td>
                        <td>{payment.user.name}</td>
                        <td>{payment.bookingDates.length}</td>
                        <td>
                          <Moment format="DD-MM-YYYY">{payment.date}</Moment>
                        </td>
                        <td>£{(payment.price / 100).toFixed(2)}</td>
                        <td>
                          <Link
                            to={{
                              pathname: `/confirmation/${payment._id}`
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
                    );
                  })}
                </tbody>
              </table>

              <div className="footer">
                <CSVLink
                  data={payments}
                  headers={csvHeaders}
                  className="btn btn-green"
                  filename={'payments-en-route-booking.csv'}
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
  { adminGetPayments }
)(AdminPayments);
