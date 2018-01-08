import {
  LOAD_ERROR,
  STORE_TOKEN,
  STORE_ID,
  SEND_INFO
} from "../action/identity";

const identityState = (state = {
  errorMessage: '',
  token: '',
  id: '',
  body: '',
}, action) => {
  switch (action.type) {
    case LOAD_ERROR : {
      // console.log(action.error)
      return Object.assign({}, state, {
        errorMessage: action.error
      })
    }

    case STORE_TOKEN: {
      return Object.assign({}, state, {
        token: action.token
      })
    }

    case STORE_ID: {
      return Object.assign({}, state, {
        id: action.id
      })
    }

    case SEND_INFO: {
      return Object.assign({}, state, {
        body: action.b
      })
    }

    default:
      return state;
  }
};

export default identityState;