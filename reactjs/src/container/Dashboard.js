import React, { Component, PropTypes } from 'react';
import Amplify, { API } from 'aws-amplify';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import appConfig from './config';
import restRequest from './restRequestClient';

import {
  pushList,
  changeCondition,
  refreshCondition,
  stopRefresh,
} from '../action/dashboardAction';
import { HeaderProfile } from '../component/Header'

const AuthConfig = {
  identityPoolId: appConfig.IdentityPoolId,
  region: appConfig.region,
  userPoolId: appConfig.UserPoolId,
  userPoolWebClientId: appConfig.ClientId
};
const btnStyle = {
  padding: 3,
  color:'#fff',
  borderRadius: 2,
  textAlign: 'center',
  backgroundColor: '#ed8b9e'
};
const marginRight = {
  marginRight:3,
  padding: 3,
  color:'#fff',
  borderRadius: 2,
  textAlign: 'center',
  backgroundColor: '#ed8b9e',
  width : 72
};

const APIConfig = {
  endpoints: appConfig.endpoints
};

const config2 = {
  Auth: AuthConfig,
  API: APIConfig
};

console.log(config2);

Amplify.configure(config2);

const endPoint=appConfig.endpoints[0].endpoint;

const container = {
  backgroundColor: '#eeeeee',
};

const myInfo = {
  // height: 120,
  // width: 200,
  // backgroundColor: 'black'
};

const myRequest = {
  // height: 800,
  // width: 200,
  margin:10,
  padding: 10,
  backgroundColor: 'white',
  borderRadius: 5,
};



class dashboard extends Component {
  constructor(props) {
    super(props);

    this.state ={
      fetching: false,
    };

    this._mapRequestList = this._mapRequestList.bind(this);
    this._mapInvitationList = this._mapInvitationList.bind(this);
    this._renderRequestList = this._renderRequestList.bind(this);
    this._renderInvitationList = this._renderInvitationList.bind(this);
    this._clickAccpet = this._clickAccpet.bind(this);
  }

  componentWillMount() {
    this.fetchList();                                             // call API gateway to fetch the user's requests and invitation list
  }

  componentDidUpdate(prevProps) {
    if (this.props.requestList !== prevProps.requestList) {
      if (this.props.requestList !== null) {
        this.setState({fetching: true})
      }
    }
    if (this.props.refresh !== prevProps.refresh) {
      this.fetchList();
      this.props.dispatch(stopRefresh());
    }
  }

  // fetchList = () => {
  //
  //   let requestParams = {
  //     method: 'GET',
  //     url: endPoint + '/dashboard',
  //   };
  //   this.restResponse = restRequest(requestParams)
  //     .then(data => {
  //       // console.log(data);
  //       this.props.dispatch(pushList(data));
  //       return data;
  //     })
  //     .catch (function(error){
  //       throw error;
  //     });
  // };


  fetchList = () => {
    const body = {
      "user_id" : this.props.id,
    };
    API.post('APIname1', '/dashboard', {body: body}).then(response => {
      console.log("response from dashboard", response);
      this.props.dispatch(pushList(response));
      return response;
    });

  }

  _mapRequestList() {
    const allList = JSON.parse(this.props.requestList);
    // console.log("2333", allList)
    const requests = allList.requests;
    // console.log("bbbb", requests);
    return (
      requests.map((item) => <li>{this._renderRequestList(item)}</li>)
    )
  }

  _mapInvitationList() {
    const allList2 = JSON.parse(this.props.requestList);
    console.log("2333", allList2)
    const invitations = allList2.invitations;
    // console.log("bbbb", invitations);
    return (
      invitations.map((item) => <li>{this._renderInvitationList(item)}</li>)
    )
  }

  _renderRequestList(item) {
    return (
      <div style={{ padding: '2rem 2rem',marginBottom: '.5rem',backgroundColor: '#eceeef', borderRadius: '.3rem'}}>
        <div className="row">
          <div className="col-md-5">
            <image style={{width: 150, height: 150, borderRadius: 5}} src={item.photo} />
            <p className="font-weight-bold" style={{textAlign: "center"}}>{item.firstname}{item.lastname}</p>
            <p style={btnStyle}>{item.req_condition}</p>
          </div>
          <div className="col-md-7">
            <h4>{item.restaurant_name}</h4><br/>
            <p style={{paddingLeft: 0}} className="col-md-9">Ratings: {item.ratings}</p>
            <p className="col-md-3">{item.price}</p>
            <p className="font-weight-bold">{item.location}</p>
            <p>{item.categories}</p>
            <p className="font-italic">{item.req_time}</p>
          </div>
        </div>
      </div>
    )
  }

  _clickAccpet(id) {
    // console.log("accept", id)
    this.props.dispatch(changeCondition(id, "accepted"));
    // this.props.dispatch(refreshCondition())
  }

  _clickReject(id) {
    this.props.dispatch(changeCondition(id, "rejected"));
    // this.props.dispatch(refreshCondition());
  }

  _renderInvitationList(item) {
    if (item.inv_condition === "pending") {
      return (
        <div style={{ padding: '2rem 2rem',marginBottom: '.5rem',backgroundColor: '#eceeef', borderRadius: '.3rem'}}>
          <div className="row">
            <div className="col-md-5">
              <image style={{width: 150, height: 150, borderRadius: 5}} src={item.photo} />
              <p className="font-weight-bold" style={{textAlign: "center"}}>{item.firstname}{item.lastname}</p>
              <button className='btn btn-small' style={marginRight} onClick={()=>this._clickAccpet(item.inv_id)}>accept</button>
              <button className='btn btn-small' style={marginRight} onClick={()=>this._clickReject(item.inv_id)}>reject</button>
            </div>
            <div className="col-md-7">
              <h4>{item.restaurant_name}</h4><br/>
              <p style={{paddingLeft: 0}} className="col-md-9">Ratings: {item.ratings}</p>
              <p className="col-md-3">{item.price}</p>
              <p className="font-weight-bold">{item.location}</p>
              <p>{item.categories}</p>
              <p className="font-italic">{item.inv_time}</p>
            </div>

          </div>
        </div>
      )
    }

    return (
      <div style={{ padding: '2rem 2rem',marginBottom: '.5rem',backgroundColor: '#eceeef', borderRadius: '.3rem'}}>
        <div className="row">
          <div className="col-md-5">
            <image style={{width: 150, height: 150, borderRadius: 5}} src={item.photo} />
            <p className="font-weight-bold" style={{textAlign: "center"}}>{item.firstname}{item.lastname}</p>
            <p style={btnStyle}>{item.inv_condition}</p>
          </div>
          <div className="col-md-7">
            <h4>{item.restaurant_name}</h4><br/>
            <p style={{paddingLeft: 0}} className="col-md-9">Ratings: {item.ratings}</p>
            <p className="col-md-3">{item.price}</p>
            <p className="font-weight-bold">{item.location}</p>
            <p>{item.categories}</p>
            <p className="font-italic">{item.inv_time}</p>
          </div>

        </div>
      </div>
    )
  }
  _renderUserName(){
    const name = JSON.parse(this.props.requestList);
    return(
      <h2 style={{padding:'20px 40px'}}>Welcome! <i>{name.firstname} {name.lastname}</i> </h2>
    )
  }

  render() {
    // console.log("state",this.state.fetching)
    return (

      <div className="container">
        <HeaderProfile
          linkLeft="/dashboard"
          linkRight="/login"
        />

        <div className="row" style={container}>
          <div className="row">
            {this.state.fetching && this._renderUserName()}
          </div>
          <div className="row">
            <div className="col-md-6">
              <div style={myRequest}>
                <h2 style={{padding: 10, color:'#5f5f5f'}}>My Requests</h2>
                <hr/>
                <div>
                  <ul style={{padding: 0, listStyleType: "none" }}>{this.state.fetching && this._mapRequestList()}</ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div style={myRequest}>
                <h2 style={{padding: 10, color:'#5f5f5f'}}>My Invitations</h2>
                <hr/>
                <div>
                  <ul style={{padding: 0, listStyleType: "none" }}>{this.state.fetching && this._mapInvitationList()}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

dashboard.PropTypes = {
  requestList: PropTypes.string.isRequired,
  refresh: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  requestList: state.dashboardState.requestList,
  refresh: state.dashboardState.refresh,
  id: state.identityState.id,
});

export default connect(mapStateToProps)(dashboard);
