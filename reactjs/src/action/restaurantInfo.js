import React from 'react';

import appConfig from '../container/config';
import restRequest from '../container/restRequestClient';

const endPoint=appConfig.endpoints[0].endpoint;
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


export const PUSH_INFO = 'PUSH_INFO';
export const REFRESH_LIST = 'REFRESH_LIST';
export const STOP_REFRESH = 'STOP_REFRESH';

export const pushInfo = (data) => ({
  type: PUSH_INFO,
  data
});

export const refreshList = () => ({
  type: REFRESH_LIST,
});

export const stopRefresh = () => ({
  type: STOP_REFRESH,
})

export const addToWishList = (id, restaurant_id, time) => async (dispatch) => {
  const body = {

    "user_id": id,
    "restaurant_id": restaurant_id,
    "time": time
  };

  // let requestParams = {
  //   method: 'GET',
  //   url: endPoint + '/info',
  //   body: body
  // };
  // let restResponse = restRequest(requestParams)
  //   .then(data => {
  //     console.log(data);
  //     // this.props.dispatch(pushList(data));
  //     return data;
  //   })
  //   .catch (function(error){
  //     throw error;
  //   });

  API.post('APIname1', '/info/invite', {body:body}).then(response => {
    console.log(response);
    // dispatch(pushInfo(response));
  });
};

export const inviteGuest = (uid, id, restaurant_id, time) => async () => {
  const body = {
    "user_to_id": uid,
    "user_id": id,
    "restaurant_id": restaurant_id,
    "time": time
  };

  // let requestParams = {
  //   method: 'GET',
  //   url: endPoint + '/info',
  //   body: body
  // };
  // let restResponse = restRequest(requestParams)
  //   .then(data => {
  //     console.log(data);
  //     // this.props.dispatch(pushList(data));
  //     return data;
  //   })
  //   .catch (function(error){
  //     throw error;
  //   });

  API.post('APIname1', '/info/waitinglist', {body:body}).then(response => {
    console.log(response);
  });
}
