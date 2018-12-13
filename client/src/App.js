import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import './css/main.min.css';

// import provider and store
import { Provider } from 'react-redux';
import store from './store';

// import routes
import PrivateRoute from './components/common/PrivateRoute';

// import components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import EditAccount from './components/auth/EditAccount';
import Map from './components/map/Map';
import CheckoutDetails from './components/checkout/CheckoutDetails';
import Bookings from './components/bookings/Bookings';
import PastBookings from './components/bookings/PastBookings';
import Confirmation from './components/confirmation/Confirmation';
import ConfirmEmail from './components/auth/ConfirmEmail';
import NoMatch from './components/nomatch/NoMatch';
import Payments from './components/payments/Payments';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Map} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/confirm-email/:token" component={ConfirmEmail} />
              <PrivateRoute
                exact
                path="/checkout/:id"
                component={CheckoutDetails}
              />
              <PrivateRoute path="/bookings" component={Bookings} />
              <PrivateRoute path="/past-bookings" component={PastBookings} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/create-profile" component={CreateProfile} />
              <PrivateRoute path="/edit-profile" component={EditProfile} />
              <PrivateRoute path="/edit-account" component={EditAccount} />
              <PrivateRoute path="/confirmation/:id" component={Confirmation} />
              <PrivateRoute path="/payments" component={Payments} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
