import React from 'react';
import "babel-polyfill";
import {
  pushInfo,
} from './restaurantInfo';


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


export const PUSH_LIST = 'PUSH_LIST';


export const pushList = (data) => ({
  type: PUSH_LIST,
  data,
});

export const chooseTimeSlot = (uid, rid, date, time) => async (dispatch) => {
  const body = {
    "restaurant_id": rid,
    "user_id": uid,
    "date": date,
    "time_slot": time,
  };

  console.log("body2333", body);

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

  // console.log("res",restResponse);
  API.post('APIname1', '/info', {body:body}).then(response => {
    console.log('response form info',response);
    // dispatch(pushList(response));
    dispatch(pushInfo(response));
  });

};

const changeFormat = (time) => {
  console.log("bbb", time);
    // e.preventDefault();
  let timeFormat;
    let sec_num = parseInt(time, 10); // don't forget the second param
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    timeFormat = hours+':'+minutes;
    console.log("aaa", timeFormat);
    return timeFormat;
  }
// }

export const search = (date, time, location) => async (dispatch) => {
  let timeFormat = await changeFormat(time);

  const body = {
    "date": date,
    "time": timeFormat,
    "location": location
  };
  // console.log("23333", body);

  // let requestParams = {
  //   method: 'GET',
  //   url: endPoint + '/search',
  //   // body: body
  // };
  // console.log("body", body);
  // let restResponse = restRequest(requestParams)
  //   .then(data => {
  //     console.log(data);
  //     this.props.dispatch(pushList(data));
  //     return data;
  //   })
  //   .catch (function(error){
  //     throw error;
  //   });

  API.post('APIname1', '/search', {body:body}).then(response => {
    console.log('response form search',response);
    dispatch(pushList(response));
  });
};
