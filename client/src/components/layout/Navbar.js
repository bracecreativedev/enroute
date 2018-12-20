import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentProfile } from '../../actions/profileActions';
import { logoutUser } from '../../actions/authActions';
import { setFeaturedLocation } from '../../actions/locationActions';
import Logo from './logo.png';
import '../../css/hamburgers.min.css';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      isActive: false
    };

    this.hamburgerClick = this.hamburgerClick.bind(this);
  }

  onLogoutClick(e) {
    e.preventDefault();

    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.props.setFeaturedLocation();
  }

  hamburgerClick(e) {
    const { isActive } = this.state;

    if (isActive) {
      return this.setState({ isActive: false });
    } else {
      return this.setState({ isActive: true });
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { admin } = this.props.auth.user;
    const { isActive } = this.state;

    let hamburgerClass;

    if (isActive) {
      hamburgerClass = 'navbar-toggler hamburger hamburger--spring is-active';
    } else {
      hamburgerClass = 'navbar-toggler hamburger hamburger--spring';
    }

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="btn btn-green" to="/bookings">
            Bookings
          </Link>
        </li>
        <li className="nav-item dropdown my-auto">
          <button
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user.name}
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdown"
          >
            <Link className="dropdown-item" to="/bookings">
              <i className="fas fa-ticket-alt" /> Bookings
            </Link>

            <Link className="dropdown-item" to="/payments">
              <i className="fas fa-credit-card" /> Payments
            </Link>
            <div className="dropdown-divider" />
            <Link className="dropdown-item" to="/edit-profile">
              <i className="fas fa-user-circle" /> Edit Profile
            </Link>

            <Link className="dropdown-item" to="/edit-account">
              <i className="fas fa-key" /> Edit Account Details
            </Link>

            {admin ? (
              <span>
                <div className="dropdown-divider" />
                <Link
                  className="dropdown-item"
                  to="/admin-panel"
                  style={{ color: '#96c236' }}
                >
                  <i
                    className="fas fa-unlock-alt"
                    style={{ color: '#96c236' }}
                  />{' '}
                  Admin Panel
                </Link>
              </span>
            ) : null}

            <div className="dropdown-divider" />
            <button
              className="dropdown-item"
              onClick={this.onLogoutClick.bind(this)}
              href="#"
            >
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
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
            className={hamburgerClass}
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={this.hamburgerClick}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
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
  { logoutUser, clearCurrentProfile, setFeaturedLocation }
)(Navbar);
