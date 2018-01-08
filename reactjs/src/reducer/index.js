import { combineReducers } from 'redux';
import identityState from './identityReducer';
import dashboardState from './dashboardReducer';
import restaurantState from './restaurantReducer';
import searchState from './searchReducer';

const rootReducer = combineReducers({
  identityState: identityState,
  dashboardState: dashboardState,
  restaurantState: restaurantState,
  searchState: searchState,
});

export default rootReducer;