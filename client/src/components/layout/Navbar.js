import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentProfile } from '../../actions/profileActions';
import { logoutUser } from '../../actions/authActions';
import Logo from './logo.png';

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    console.log('logout');
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="btn btn-green" to="/bookings">
            Bookings
          </Link>
        </li>
        <li className="nav-item dropdown my-auto">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user.name}
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <Link className="dropdown-item" to="/edit-profile">
              Profile
            </Link>
            <div className="dropdown-divider" />
            <a
              className="dropdown-item"
              onClick={this.onLogoutClick.bind(this)}
              href="#"
            >
              Logout
            </a>
          </div>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-green" to="/register">
            Register
          </Link>
        </li>
      </ul>
    );

    return (
      <header>
        <nav className="navbar navbar-expand-sm navbar-light">
          <Link className="navbar-brand" to="/">
            <img src={Logo} alt="En Route Logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
