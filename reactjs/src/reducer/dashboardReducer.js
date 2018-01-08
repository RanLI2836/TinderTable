import {
  PUSH_LIST,
  REFRESH_CONDITION,
  STOP_REFRESH,
} from '../action/dashboardAction';

const dashboardState = (state = {
  requestList: [],
  refresh: true,
}, action) => {
  switch (action.type) {
    case PUSH_LIST: {
      return Object.assign({}, state, {
        requestList: action.data
      })
    }
    case REFRESH_CONDITION: {
      return Object.assign({}, state, {
        refresh: !state.refresh
      })
    }

    case STOP_REFRESH: {
      return Object.assign({}, state, {
        refresh: state.refresh
      })
    }


    default:
      return state;
  }
};

export default dashboardState;