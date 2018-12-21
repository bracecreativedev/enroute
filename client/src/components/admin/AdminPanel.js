import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  document.title = 'Admin Panel - En Route Parking';

  return (
    <div className="page-container">
      <div className="container">
        <div className="admin-box">
          <div className="main-content">
            <div className="header">
              <h1 className="heading">Admin Panel</h1>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="panel-card">
                  <div className="card-content">
                    <div className="icon">
                      <i className="fas fa-users" />
                    </div>
                    <h2 className="heading">Users</h2>
                  </div>
                  <Link to="/admin-panel/users" className="footer-link">
                    <div className="footer">
                      <p>Manage &rarr;</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-4">
                <div className="panel-card">
                  <div className="card-content">
                    <div className="icon">
                      <i className="fas fa-location-arrow" />
                    </div>
                    <h2 className="heading">Locations</h2>
                  </div>
                  <Link to="/admin-panel/locations" className="footer-link">
                    <div className="footer">
                      <p>Manage &rarr;</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-4">
                <div className="panel-card">
                  <div className="card-content">
                    <div className="icon">
                      <i className="fas fa-credit-card" />
                    </div>
                    <h2 className="heading">Payments</h2>
                  </div>
                  <Link to="/admin-panel/payments" className="footer-link">
                    <div className="footer">
                      <p>Manage &rarr;</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-md-4">
                <div className="panel-card">
                  <div className="card-content">
                    <div className="icon">
                      <i className="fas fa-ticket-alt" />
                    </div>
                    <h2 className="heading">Bookings</h2>
                  </div>
                  <Link to="/admin-panel/bookings" className="footer-link">
                    <div className="footer">
                      <p>Manage &rarr;</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
