import React, { Component } from 'react';
import { Link } from 'react-router';

const brandStyle = {
  color: '#ed8b9e',
  fontSize:28,
  fontWeight: 'bold',
  textDecoration:'none'
}
const btnStyle = {
  color:'#fff',
  backgroundColor: '#ed8b9e'
};

export const HeaderBasic = (props) => {
  const {
    linkLeft,
    linkRight
  } = props;
  return(
    <nav className="navbar navbar-default">
      <navbar className="navbar-brand col-md-8">
          <Link style = {brandStyle}  to="/"><i>TinderTable</i></Link>
      </navbar>
      <ul className='nav navbar-nav navbar-right col-md-3' style={{paddingTop: 6}}>
        <div style={{float: 'right'}}>
          {/*<div className="right">*/}
          <button className="btn btn-small" >
            <Link  style={{color:'#ed8b9e', textDecoration:'none'}}to={linkLeft}>Sign In</Link>
          </button>
          {/*</div>*/}
          <button className="btn btn-small" style={{backgroundColor: '#ed8b9e'}}>
            <Link style={{color:'#fff',textDecoration:'none'}} to={linkRight}>Sign Up</Link>
          </button>
        </div>
      </ul>
  </nav>
  );
};

export const HeaderProfile = (props) => {
  const {
    linkLeft,
    linkRight,
  } = props;

  return (
    <div className='row'>
      <nav className="navbar" style={{borderRadius:0, borderBottom: '2px solid #f4f4f4'}}>
        <navbar className="navbar-brand col-md-8">
          <Link style = {brandStyle}  to="/"><i>TinderTable</i></Link>
        </navbar>
        <ul className='nav navbar-nav navbar-right col-md-3' style={{paddingTop: 7}}>
          <button className="btn btn-small" >
            <Link style={{color:'#7f7f7f', textDecoration:'none'}} to={linkLeft}>Dashboard</Link>
          </button>
          {/*<div>*/}
          {/*<Link>link1</Link>*/}
          {/*</div>*/}
          <button className="btn btn-small">
            <Link style={{color:'#7f7f7f', textDecoration:'none'}} to={linkRight}>Log out</Link>
          </button>
        </ul>
      </nav>
    </div>
  )
}
