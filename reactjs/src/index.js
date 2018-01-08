import React,{ Component } from 'react';
import { createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import promise from 'redux-promise';

import reducers from './reducer';
import route from './route'



const createStoreWithMiddleware = applyMiddleware(thunk, promise, logger)(createStore);

//take this component's generated HTML and put it on the page(in the DOM).
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
  <Router history={browserHistory} routes={route}/>
  </Provider>,
  document.querySelector('.container'));
