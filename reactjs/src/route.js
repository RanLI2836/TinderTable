import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';

import HomePage from './container/HomePage';
import Login from './container/Login';
import Signup from './container/Signup';
import SearchList from './container/SearchList';
import dashboard from "./container/Dashboard";
import restaurant from './container/restaurant';
import test from './container/test';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="login" component={Login}/>
    <Route path="signup" component={Signup}/>
    <Route path="searchList" component={SearchList}/>
    <Route path="dashboard" component={dashboard}/>
    <Route path="restaurant" component={restaurant}/>
    <Route path="test" component={test}/>
  </Route>

);