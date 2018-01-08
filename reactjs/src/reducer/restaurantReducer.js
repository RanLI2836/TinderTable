import {
  PUSH_INFO,
  REFRESH_LIST,
  STOP_REFRESH,
} from '../action/restaurantInfo';

const restaurantState = (state = {
  info: [],
  refresh: false,
}, action) => {
  switch (action.type) {
    case PUSH_INFO: {
      return Object.assign({}, state, {
        info: action.data
      })
    }

    case REFRESH_LIST: {
      return Object.assign({}, state, {
        refresh: true,
      })
    }

    case STOP_REFRESH: {
      return Object.assign({}, state, {
        refresh: false,
      })
    }


    default:
      return state;
  }
};

export default restaurantState;