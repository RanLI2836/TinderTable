import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { HeaderProfile } from '../component/Header';
import TimePicker from 'react-bootstrap-time-picker';
import {
  pushList,
  chooseTimeSlot,
  search,
} from '../action/searchAction'

import appConfig from './config';
import restRequest from './restRequestClient';

const endPoint=appConfig.endpoints[0].endpoint;

const listStyle = {
  display: "inline-block",
  margin:5
};
const btnStyle = {
  width: 80,
  padding: '2px 5px',
  textAlign: 'center'
};


class SearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
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
    this._handleSlot = this._handleSlot.bind(this);
    this._renderSlot = this._renderSlot.bind(this);
    this._mapRestaurantInfo = this._mapRestaurantInfo.bind(this);
    this._renderRestaurant = this._renderRestaurant.bind(this);
  }

  componentWillMount() {
    // this.fetchList();                                             // call API gateway to fetch the user's requests and invitation list
    console.log("usreid", this.props.id);
    if (this.props.id === null) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.list !== prevProps.list) {
      this.setState({ fetching: true });
      // console.log("2333", this.props.list);
    }
  }

  // fetchList = () => {
  //
  //   let requestParams = {
  //     method: 'GET',
  //     url: endPoint + '/search',
  //   };
  //   this.restResponse = restRequest(requestParams)
  //     .then(data => {
  //       console.log(data);
  //       this.props.dispatch(pushList(data));
  //       return data;
  //     })
  //     .catch (function(error){
  //       throw error;
  //     });
  // };

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
    // // e.preventDefault();
    // let sec_num = parseInt(this.state.time, 10); // don't forget the second param
    // let hours   = Math.floor(sec_num / 3600);
    // let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    // let seconds = sec_num - (hours * 3600) - (minutes * 60);
    //
    // if (hours   < 10) {hours   = "0"+hours;}
    // if (minutes < 10) {minutes = "0"+minutes;}
    // if (seconds < 10) {seconds = "0"+seconds;}
    // this.setState({timeFormat: hours+':'+minutes})

  }

  _redirect(e) {
    e.preventDefault();
    // this._changeTimeFormat();
    this.props.dispatch(search(this.state.date, this.state.time, this.state.location));        // need to double check
    // console.log("2333", this.state.timeFormat)
    this.props.history.push('/searchList');
  }


  _handleSlot(time, rid) {                                             // pass userid, restaurantid, date, time slot to backend when click the time slot button
    const userid = this.props.id;
    const date = this.props.list[0].date;
    console.log("111111",date);
    this.props.dispatch(chooseTimeSlot(userid, rid, date, time));
    this.props.history.push('/restaurant');

  }

  _renderSlot(i, rid) {
    const time = i.time;
    const avail = i.available;
    // console.log("2333", rid);
    if(avail === 'true') {
      return (
        <button className="btn btn-primary" style={btnStyle} onClick={() => this._handleSlot(time, rid)}>{time}</button>
      )
    } else {
      return (
        <button className="btn btn-outline-secondary" style={btnStyle} disabled={true}>{time}</button>
      )
    }
  }

  _renderWaitList(i) {
    return (
      <button className="btn btn-primary" style={btnStyle}>{i}</button>
    )
  }

  _mapRestaurantInfo() {
    const restaurant = this.props.list;
    return (
      restaurant.map((item) =>
        <li>
          {this._renderRestaurant(item)}
        </li>)
    )
  }

  _renderRestaurant(item) {
    const name = item.restaurant_name;
    const price = item.price;
    const location = item.location.display_address;
    return (
      <div style={{ padding: '2rem 2rem',marginBottom: '.5rem',backgroundColor: '#eceeef', borderRadius: '.3rem'}}>
        <div className='row'>
          <div className='col-md-3'>
            <img style={{width:260, height:260, backgroundSize:'cover', borderRadius: 5}} src={item.image_url}/>
          </div>

          <div className='col-md-9'>
            <div className="row" style={{padding: "0px 40px"}} >
              <p className="lead "><strong>{name}</strong></p>

              <div className='row' style={{paddingRight: 40}}>
                <small className='font-italic col-md-2'>{item.review_count} reviews!</small>
                <small className='font-italic col-md-5'>Avg. rating: <strong>{item.rating}</strong></small>
                <small className='font-italic col-md-5'>{price}</small>
              </div>
              <br/>
              <p><i>{item.categories[0].title}</i> </p>
              <p><i>{location[0]} {location[1]}</i></p>

              <ul style={{listStyleType: "none", padding:0}}>{item.aw_list.map((i) =>
                <li style={listStyle}>{this._renderSlot(i, item.restaurant_id)}</li>)}
              </ul>
              <ul style={{listStyleType: "none", padding:0}}>{item.waitlist.map((i) =>
                <li style={listStyle}>{this._renderWaitList(i)}</li>)}
              </ul>

              <small className='font-italic'><strong>Reviews: </strong>{item.first_review.text}</small>
            </div>

          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <HeaderProfile
          linkLeft="/dashboard"
          linkRight="login"
        />
        <div>
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
        </div>
        {!this.state.fetching && (
          <div>
            <h3 className='font-italic'>loading...</h3>
          </div>
        )}
        {this.state.fetching && (
          <div className='row'>
            <div>Todo: change the searchbar!</div>
            <ul style={{padding: 0, listStyleType: "none" }}>{this._mapRestaurantInfo()}</ul>
          </div>
        )}
      </div>
    )
  }
}

SearchList.PropTypes = {
  list: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  list: state.searchState.list,
  id: state.identityState.id,
});

export default connect(mapStateToProps)(SearchList);