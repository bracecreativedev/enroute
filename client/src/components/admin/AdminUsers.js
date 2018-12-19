import React, { Component } from 'react';
import { connect } from 'react-redux';
import { adminGetUsers } from '../../actions/adminActions';
import TextFieldGroupHover from '../common/TextFieldGroupHover';
import Moment from 'react-moment';

class AdminUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      id: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.adminGetUsers();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    const { name, email, id } = this.state;
    e.preventDefault();

    let queryOptions = {
      name,
      email,
      id
    };

    this.props.adminGetUsers(queryOptions);
  }

  render() {
    const { users } = this.props.admin;
    const { errors } = this.state;

    return (
      <div className="page-container">
        <div className="container">
          <div className="bookings-box">
            <div className="main-content">
              <div className="header d-block">
                <h1 className="heading">Manage Users</h1>
                <div className="filters">
                  <form
                    className="form-label form-css-label"
                    onSubmit={this.onSubmit}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <fieldset style={{ marginBottom: '5px' }}>
                          <TextFieldGroupHover
                            label="Name"
                            name="name"
                            type="text"
                            value={this.state.name}
                            onChange={this.onChange}
                            error={errors.name}
                          />
                        </fieldset>
                      </div>

                      <div className="col-md-6">
                        <fieldset style={{ marginBottom: '5px' }}>
                          <TextFieldGroupHover
                            label="Email Address"
                            name="email"
                            type="text"
                            value={this.state.email}
                            onChange={this.onChange}
                            error={errors.email}
                          />
                        </fieldset>
                      </div>

                      <div className="col-md-6">
                        <fieldset style={{ marginBottom: '5px' }}>
                          <TextFieldGroupHover
                            label="User ID"
                            name="id"
                            type="text"
                            value={this.state.id}
                            onChange={this.onChange}
                            error={errors.id}
                          />
                        </fieldset>
                      </div>
                    </div>

                    <button
                      className="btn btn-green"
                      style={{ marginTop: '20px' }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>

              <table>
                <tbody>
                  <tr className="table-header">
                    <th>Name</th>
                    <th>Email</th>
                    <th>User ID</th>
                    <th>Confirmed</th>
                    <th>Registered Date</th>
                    <th>Edit</th>
                  </tr>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user._id}</td>
                      <td>{user.confirmed ? 'True' : 'False'}</td>
                      <td>
                        <Moment format="Do MMM YYYY">{user.date}</Moment>
                      </td>
                      <td>
                        <i>Coming Soon...</i>
                      </td>
                    </tr>
                  ))}
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
  { adminGetUsers }
)(AdminUsers);
