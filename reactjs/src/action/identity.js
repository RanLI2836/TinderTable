import React from 'react';
import "babel-polyfill";

export const LOAD_ERROR = 'LOAD_ERROR';
export const STORE_TOKEN = 'STORE_TOKEN';
export const STORE_ID = 'STORE_ID';
export const SEND_INFO = 'SEND_INFO';

export const loadError = (error) => ({
  type: LOAD_ERROR,
  error
});

export const storeToken = (token) => ({
  type: STORE_TOKEN,
  token
});

export const storeId = (id) => ({
  type: STORE_ID,
  id
});


export const sendInfo = (b) => ({
  type: SEND_INFO,
  b
});

export const jsonInfo = (
  email, firstName, lastName, phone, gender
) => async (
  dispatch: Function,
) => {
  const body = JSON.stringify({
    "id": email,
    "firstname": firstName,
    "lastname": lastName,
    "gender": gender,
    "phone": phone
  });
  dispatch(sendInfo(body));
};


