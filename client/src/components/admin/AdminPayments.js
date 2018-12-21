import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
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
    const { errors } = this.state;

    return (
      <div className="page-container">
        <div className="container">
          <div className="bookings-box">
            <div className="main-content">
              <div className="header d-block">
                <h1 className="heading">Manage Payments</h1>

                <div className="filters">
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
                </tbody>
              </table>
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
