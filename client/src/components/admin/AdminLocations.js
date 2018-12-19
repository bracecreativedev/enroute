import React, { Component } from 'react';
import { connect } from 'react-redux';
import { adminGetLocations } from '../../actions/adminActions';
import { Link } from 'react-router-dom';

class AdminLocations extends Component {
  componentDidMount() {
    this.props.adminGetLocations();
  }
  render() {
    const { locations } = this.props.admin;
    return (
      <div className="page-container">
        <div className="container">
          <div className="bookings-box">
            <div className="main-content">
              <div className="header d-block">
                <h1 className="heading">Manage Parking Locations</h1>
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Name</th>
                    <th>ID</th>
                    <th>Postcode</th>
                    <th>Price</th>
                    <th>Spaces</th>
                    <th>Modify</th>
                  </tr>
                  {locations.map(location => {
                    return (
                      <tr key={location._id}>
                        <td>{location.name}</td>
                        <td>{location._id}</td>
                        <td>{location.location.postcode}</td>
                        <td>£{(location.price / 100).toFixed(2)}</td>
                        <td>{location.spaces}</td>
                        <td>
                          <Link
                            to={{
                              pathname: `/admin-panel/location/${location._id}`
                            }}
                          >
                            <span className="badge badge-green">Edit</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
  { adminGetLocations }
)(AdminLocations);
