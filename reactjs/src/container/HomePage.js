import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Center from 'react-center'
import TimePicker from 'react-bootstrap-time-picker';

import { HeaderBasic } from '../component/Header';
import {
  search,
} from '../action/searchAction';

const banner = {
    backgroundImage: "url('../../image/banner.png')",
    backgroundSize: 'cover',
    width: '100%',
    height: 500,
    opacity: 0.8
};
const searchBarBox = {
    position: 'fixed',
    top: 350,
    backgroundColor: 'white',
    width: 850,
    height: 100,
    borderRadius: 10,
    padding: 30
};

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      time: 0,
      timeFormat: '',
      location: '',
    };

    this._handleTimeChange = this._handleTimeChange.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);
    this._handleLocationChange = this._handleLocationChange.bind(this);
    this._changeTimeFormat = this._changeTimeFormat.bind(this);
    this._redirect = this._redirect.bind(this);
  }

  componentDidUpdate(prevState) {
    if (this.state.time !== prevState.time) {
      // console.log("2333", this.state.time);
      // console.log("233322", prevState.time);
      // this._changeTimeFormat(e);
    }
  }

  _handleDateChange(e) {
    this.setState({date: e.target.value});
  }

  _handleTimeChange(time) {
    this.setState({ time });
  }

  _handleLocationChange(e) {
    this.setState({ location: e.target.value });
  }

  _changeTimeFormat() {
    // e.preventDefault();
      let sec_num = parseInt(this.state.time, 10); // don't forget the second param
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      this.setState({timeFormat: hours+':'+minutes})

  }

  _redirect(e) {
    e.preventDefault();
    // this._changeTimeFormat();
    // console.log("2333", this.state.timeFormat)
    if (this.props.id !== '') {
      console.log("id", this.props.id);
      this.props.dispatch(search(this.state.date, this.state.time, this.state.location));
      this.props.history.push('/searchList');
    } else {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div>
          <HeaderBasic
          linkLeft="/login"
          linkRight="/signup"
          />
          <div style={banner}>
            <Center>
              <div style={searchBarBox}>
                <Center>
                  <form onSubmit={this._redirect}>
                    <div className="col-md-4 mb-3">
                      <input className="form-control" type="date" onChange={this._handleDateChange}/>
                    </div>
                    <div className="col-md-3 mb-3">
                      <TimePicker format={24} onChange={this._handleTimeChange} value={this.state.time}/>
                    </div>
                    <div className="col-md-3 mb-3">
                      <input className="form-control"  type="text" placeholder="key word" onChange={this._handleLocationChange}/>
                    </div>
                    <div className="col-md-2 mb-3">
                      <button className="btn btn-primary">Submit</button>
                    </div>
                  </form>
                </Center>
              </div>
            </Center>
          </div>
      </div>

    )
  }
}

HomePage.PropTypes = {
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  id: state.identityState.id,
});

export default connect(mapStateToProps)(HomePage);