import React, { Component } from 'react';
import Amplify, { API } from 'aws-amplify';
import { Link } from 'react-router'

import appConfig from './config';

import restRequest from './restRequestClient';

const AuthConfig = {
  identityPoolId: appConfig.IdentityPoolId,
  region: appConfig.region,
  userPoolId: appConfig.UserPoolId,
  userPoolWebClientId: appConfig.ClientId
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

const endPoint="https://nu7tnli0lh.execute-api.us-east-1.amazonaws.com/testStage1";




// async function postData() {
//   let apiName = 'MyApiName'; // replace this with your api name.
//   let path = '/dashboard'; //replace this with the path you have configured on your API
//   let myInit = {
//     body: {
//       'hello': 'world'
//     }, // replace this with attributes you need
//     headers: {} // OPTIONAL
//   };
//   console.log("position1");
//   return await API.get(apiName, path, myInit);
// }

export default class dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // console.log(this.postData());
    console.log('pre-fetch');
    this.fetchMenuList();

    /***** AWS Amplify functions *****/
    // API.get('APIname1', '/dashboard').then(response => {
    //   console.log(response);
    // });

    console.log('after-fetch');
  }

  fetchMenuList = () => {

    let requestParams = {
      method: 'GET',
      url: endPoint + '/dashboard',
    };
    this.restResponse = restRequest(requestParams)
      .then(data => {
        console.log(data);
        this.setState({
          myTableData: data
        });
        return data;
      })
      .catch (function(error){
        throw error;
      });
  };

  render() {
    return (
      <div>
        <div style={{width: '30%', height: 800 }}>
          <image width={70}>ssjjsj</image><br/>
          <button>
            <Link to="/dashboard">My Profile</Link>
          </button><br/>
          <button >
            <Link>Notification</Link>
          </button><br/>
          <button>
            <Link>Setting</Link>
          </button><br/>
          <button>
            <Link to="login">Log Out</Link>
          </button>
        </div>
        <div style={{width: '30%', height: 800 }}>
          <h2>My request</h2>

        </div>
      </div>

    )
  }
}