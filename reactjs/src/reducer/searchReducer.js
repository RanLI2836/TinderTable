import {
  PUSH_LIST,
} from '../action/searchAction';

const searchState = (state = {
  list: [],
}, action) => {
  switch (action.type) {
    case PUSH_LIST: {
      return Object.assign({}, state, {
        list: action.data
      })
    }


    default:
      return state;
  }
};

export default searchState;