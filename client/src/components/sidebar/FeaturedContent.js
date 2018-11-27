import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFeaturedLocation } from '../../actions/locationActions';
import { createBooking, setBookingData } from '../../actions/bookingActions';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

// import styles
import { FeaturedContentContainer, Header } from './styled';

class FeaturedContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      selectedDays: []
    };

    this.handleDayClick = this.handleDayClick.bind(this);
  }

  componentDidMount() {
    const { featuredLocation } = this.props.locations;

    this.props.setBookingData({
      location: featuredLocation,
      startDate: this.state.startDate
    });
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.state;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.setState({ selectedDays });
  }

  onClick = e => {
    this.props.setFeaturedLocation();
  };

  render() {
    const { featuredLocation } = this.props.locations;
    const { selectedDays } = this.state;
    const today = new Date();

    let formattedArray = [];
    selectedDays.map(day =>
      formattedArray.push(moment(day).format('DD-MM-YY'))
    );
    let csvDays = formattedArray.join(',');

    // disabled dates
    const disabled = ['2018-11-28T00:00:00.000Z', '2018-11-27T00:00:00.000Z'];
    const formattedDates = [];
    disabled.map(date => formattedDates.push(new Date(date)));
    formattedDates.push({ before: today });

    return (
      <FeaturedContentContainer>
        <Header>
          <h3>{featuredLocation.name}</h3>

          <button onClick={this.onClick}>
            <i className="fas fa-times" />
          </button>
        </Header>

        <div className="content">
          <strong className="text-muted">ADDRESS</strong>
          <p>
            {featuredLocation.location.street}
            <br />
            {featuredLocation.location.postcode}
          </p>

          <DayPicker
            firstDayOfWeek={1}
            selectedDays={this.state.selectedDays}
            onDayClick={this.handleDayClick}
            disabledDays={formattedDates}
          />
          <br />
          <Link to={`/booking/${featuredLocation._id}/?dates=${csvDays}`}>
            BOOK NOW
          </Link>
        </div>
      </FeaturedContentContainer>
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locations
});

export default connect(
  mapStateToProps,
  { setFeaturedLocation, createBooking, setBookingData }
)(FeaturedContent);
