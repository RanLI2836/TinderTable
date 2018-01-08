import React, { Component, PropTypes } from 'react';
import { connect } from  'react-redux';
import { Link } from 'react-router';

import { HeaderProfile } from '../component/Header';
import {
  pushInfo,
  addToWishList,
  refreshList,
  stopRefresh,
  inviteGuest,
} from '../action/restaurantInfo';

import appConfig from './config';
import restRequest from './restRequestClient';

const endPoint=appConfig.endpoints[0].endpoint;

const listStyle = {
  display: "inline-block",
  margin:5
};
const restaurantImg = {
  backgroundSize: 'cover',
  width: '100%',
  height: 300,
  borderRadius: 5
};
const btnStyle = {
  width: 75,
  padding: 5,
  color:'#fff',
  border:"2px solid #ed8b9e",
  borderRadius: 3,
  textAlign: 'center',
  backgroundColor: '#ed8b9e',
  margin: 3
};

class restaurant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      priceDisable: true,
    }

    this._mapRestaurantInfo = this._mapRestaurantInfo.bind(this);
    this._mapReviews = this._mapReviews.bind(this);
    this._mapGuest = this._mapGuest.bind(this);
    this._logout = this._logout.bind(this);
    this._handleInvite = this._handleInvite.bind(this);
    this._handleWishList = this._handleWishList.bind(this);
  }

  componentWillMount() {
    // this.fetchList();                                             // call API gateway to fetch the user's requests and invitation list
    // this.props.dispatch(stopRefresh());
    // console.log("refresh", this.props.refresh);
  }

  componentDidUpdate(prevProps) {
    if (this.props.info !== prevProps.info) {
      this.setState({ fetching: true });
      // const rest = this.props.info.restaurant_info;
    }

    if (this.props.refresh === true) {
      // this.fetchList();
      this.props.dispatch(stopRefresh());
    }
  }

  _logout() {
  //  delete session
  }

  // fetchList = () => {
  //
  //   let requestParams = {
  //     method: 'GET',
  //     url: endPoint + '/info',
  //   };
  //   this.restResponse = restRequest(requestParams)
  //     .then(data => {
  //       console.log(data);
  //       this.props.dispatch(pushInfo(data));
  //       return data;
  //     })
  //     .catch (function(error){
  //       throw error;
  //     });
  // };

  _handleInvite(uid) {
    const rest_id = this.props.info.restaurant_info.restaurant_id;
    const time = this.props.info.restaurant_info.time;
    this.props.dispatch(inviteGuest(uid, this.props.id, rest_id, time));
    this.props.history.push('/dashboard');
  }

  _handleWishList() {
    const rest_id = this.props.info.restaurant_info.restaurant_id;
    const time = this.props.info.restaurant_info.time;
    console.log("timetime", time);
    this.props.dispatch(addToWishList(this.props.id, rest_id, time));
    this.props.dispatch(refreshList());
  }

  _mapGuest() {
    const guest = this.props.info.targets;
    return (
      <div>
        <div style={{textAlign:"center"}}>
          <p className='lead font-italic'> Invite the person you want to eat with~</p>
        </div>
        <ul style={{listStyleType: "none" ,  textAlign: 'center'}}>
          {guest.map((item) => <li style={listStyle}>
                                  <button style={{border:"0px solid white"}}  onClick={() => this._handleInvite(item.user_id)}>
                                    <image style={{width: 170, height: 170, borderRadius: 5,boxShadow: '1px 2px 4px 2px #ddd'}}
                                           src={item.photo} />
                                  </button>
                                </li>)}
        </ul>
        <div style={{textAlign: 'center'}}>
          <p className="lead font-italic" ><strong style={{color: "#ed8b9e"}}>OR</strong></p>
          <button
            className='btn btn-small'
            style={{border:"1px solid grey", borderRadius: 2, color: "grey", display:"inline-block"}}
            onClick={this._handleWishList}
          >Just add me to waitlist!
          </button>
        </div>

      </div>
    )
  }

  _mapRestaurantInfo() {
    console.log("2333", this.props.info.restaurant_info);
    const restaurantInfo = this.props.info.restaurant_info;
    return (
      <div>

        <div className="jumbotron">
          <div className="row">
            <div className="col-md-4">
              <img style={restaurantImg} src={restaurantInfo.image_url}/>
            </div>
            <div className="col-md-8">
              <h1 className="display-3">{restaurantInfo.restaurant_name}</h1>
              <p className="lead font-italic" style={{padding: 0}}><strong>Ratings: </strong>{restaurantInfo.ratings}</p>
              <p className="lead"><i><strong>Price: </strong></i>{restaurantInfo.prices}</p>
              <p className="lead"><i><strong>Categories:  </strong></i> {restaurantInfo.categories}</p>
              <p className="lead"><i><strong>Location:  </strong></i> {restaurantInfo.location}</p>
              <p className="lead"><i><strong>Contact us:  </strong></i> {restaurantInfo.phone}</p>

            </div>
          </div>
          <hr className="my-4"/>
          <div className="row" style={{padding: 20}} >
            <p className="lead font-italic col-md-10" ><strong style={{color: "#ed8b9e"}}>Recommended Reviews</strong></p>
            <p className="lead font-italic col-md-2"><strong style={{color: "#ed8b9e"}}>{restaurantInfo.review_count}</strong> reviews!</p>
          </div>
          <ul style={{listStyleType: "none" , padding: '0px 40px'}}>{this._mapReviews(restaurantInfo.reviews.reviews)}</ul>
        </div>

      </div>
    )
  }


  _mapReviews(r) {
    return (
      r.map((item) => <li>
        <div className='row'>
          <div className='col-md-2'>
            <img style={{width:110, height:110, backgroundSize:'cover', borderRadius: 3}} src={item.user.image_url}/>
          </div>
          <div className='col-md-10'>
            <div className="row" style={{padding: "0px 20px"}} >
              <p className="lead "><strong>{item.user.name}</strong></p>
              <small> <i> Rating: </i>{item.rating}</small>
              <small className='font-italic' style={{float: "right"}}>{item.time_created}</small>
            </div>
            <div className="row" style={{padding: "0px 20px"}} >
              <p className="lead">{item.text}</p>
            </div>
          </div>
        </div>
        <hr className="my-4"/>
        </li>)
    )
  }

  render() {
    return (
      <div>
        <HeaderProfile
          linkLeft="/dashboard"
          linkRight="/login"
        />

        <div style={{height: 340, justifyContent: 'center'}}>
          {this.state.fetching && this._mapGuest()}
        </div>

        <div>
          {this.state.fetching && this._mapRestaurantInfo()}
        </div>
        
      </div>
    )
  }
}

restaurant.PropTypes = {
  info: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  refresh: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  info: state.restaurantState.info,
  id: state.identityState.id,
  refresh: state.restaurantState.refresh,
});


export default connect(mapStateToProps)(restaurant);