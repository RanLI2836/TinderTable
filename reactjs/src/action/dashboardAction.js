import React from 'react';

import appConfig from '../container/config';
import restRequest from '../container/restRequestClient';
const endPoint=appConfig.endpoints[0].endpoint;

export const PUSH_LIST = 'PUSH_LIST';
export const REFRESH_CONDITION = 'REFRESH_CONDITION';
export const STOP_REFRESH = 'STOP_REFRESH';


// amplify configs
import Amplify, {API} from 'aws-amplify';
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
Amplify.configure(config2);

export const pushList = (data) => ({
  type:PUSH_LIST,
  data
});

export const refreshCondition = () => ({
  type: REFRESH_CONDITION,
});

export const stopRefresh = () => ({
  type: STOP_REFRESH,
})

export const changeCondition = (rid, invCondition) => async (dispatch) => {
  const body = {
    "reservation_id" : rid,
    "condition": invCondition
  };

  API.post('APIname1', '/dashboard/accept-reject', {body:body}).then(response => {
    console.log(response);
    API.get('APIname1', '/dashboard').then(response => {
      console.log(response);
      dispatch(refreshCondition());
    });
  });

  // let requestParams = {
  //   method: 'GET',
  //   url: endPoint + '/dashboard/accept-reject',
  //   // body: body
  // };
  // console.log("body", body);
  // let restResponse = restRequest(requestParams)
  //   .then(data => {
  //     console.log(data);
  //     // this.props.dispatch(pushList(data));
  //     return data;
  //   })
  //   .catch (function(error){
  //     throw error;
  //   });

  // let requestParams = {
  //   method: 'GET',
  //   url: endPoint + '/dashboard',
  //   // body: body
  // };
  // console.log("body", body);
  // let restResponse = restRequest(requestParams)
  //   .then(data => {
  //     console.log(data);
  //     // this.props.dispatch(pushList(data));
  //     return data;
  //   })
  //   .catch (function(error){
  //     throw error;
  //   });


};
