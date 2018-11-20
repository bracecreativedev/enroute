import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';
import './App.css';

// import provider and store
import { Provider } from 'react-redux';
import store from './store';

// import routes
import PrivateRoute from './components/common/PrivateRoute';

// import components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import Map from './components/map/Map';

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
    // store.dispatch(logoutUser());
    // Clear current Profile
    // store.dispatch(clearCurrentProfile());
    // Redirect to login
    // window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Switch>
              <PrivateRoute exact path="/" component={Map} />
            </Switch>
            <Switch>
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute path="/create-profile" component={CreateProfile} />
            </Switch>
            <Switch>
              <PrivateRoute path="/edit-profile" component={EditProfile} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
