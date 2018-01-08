import {Config, CognitoIdentityCredentials} from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
// import 'amazon-cognito-identity-js/dist/amazon-cognito-identity'

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { HeaderBasic } from '../component/Header';
import Center from 'react-center';
import appConfig from './config';
import restRequest from './restRequestClient';

import {
  loadError,
  jsonInfo
} from "../action/identity";

const topPadding = {
    paddingTop: '80px'
};
const btnStyle = {
    color:'#fff',
    backgroundColor: '#ed8b9e'
};
const testImage = {
    backgroundImage: "url('../../image/signinImg.png')",
    width: 300,
    height: 300,
    borderRadius: 150
};

const endPoint=appConfig.endpoints[0].endpoint;

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      gender: '',
      phone: '',
      // success: false
    };

    this._SignUp = this._SignUp.bind(this);
    this.auth = this.auth.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // this.setState({ success: false });
    this.props.dispatch(loadError(''));
  }

  componentDidUpdate(prevProps) {
    if (this.props.body !== prevProps.body) {
      this.auth();
    }

  }

  auth() {
    const { body } = this.props;

    let requestParams = {
      method: 'POST',
      url: endPoint + '/signup',
      body: body,
    };
    this.restResponse = restRequest(requestParams)
      .then(data => {
        console.log(data);
        this.setState({
          myTableData: data
        });
        return data;
      })
      .catch (function(error){
        throw error;
      });
  }

  handleFirstNameChange(e) {
    this.setState({firstName: e.target.value});
  }

  handleLastNameChange(e) {
    this.setState({lastName: e.target.value});
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleZipCodeChange(e) {
    this.setState({zipCode: e.target.value});
  }

  handleGenderChange(e) {
    this.setState({gender: e.target.value});
  }

  handlePhoneChange(e) {
    this.setState({phone: e.target.value});
  }

  checkValid(e) {                                                  // check whether there is any info missing in this form
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      phone,
    } = this.state;

    if (firstName && lastName && email && password && gender && phone) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email.toLowerCase())) {
        this.props.dispatch(loadError('the email format is wrong'));
        return false;
      }
      console.log('length',password.length)
      if (password.length < 6) {

        this.props.dispatch(loadError('the length of password must be greater than 6'));
        return false;
      }
      return true;

    }
    if (!firstName) {
      this.props.dispatch(loadError('there is no first name'));
      return false;
    }
    if (!lastName) {
      this.props.dispatch(loadError('there is no last name'));
      return false;
    }
    if (!email) {
      this.props.dispatch(loadError('there is no email'));
      return false;
    }
    if (!password) {
      this.props.dispatch(loadError('there is no password set'));
      return false;
    }
    if (!gender) {
      this.props.dispatch(loadError('you forget to fill out your gender'));
    }

    if (!phone) {
      this.props.dispatch(loadError('the phone number is missing'));
      return false;
    }
  }

  renderErrorMessage() {                                           // if there is any info missing, render the corresponding error
    // console.log("show", this.props.errorMessage);
    return (
      <div>
        <p>{this.props.errorMessage}</p>
      </div>
    )
  }

  handleSubmit(e) {
    const {
      email,
      firstName,
      lastName,
      gender,
      phone
    } = this.state;

    this.props.dispatch(loadError(''));
    if (this.checkValid(e)) {                                      // check whether this form is valid, if it is, submit it
      e.preventDefault();
      const id = this.state.email.trim();
      const password = this.state.password.trim();
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: id
        }, {
          Name: 'username',
          Value: id
        })
      ];
      userPool.signUp(id, password, attributeList, null, (err, result) => {
        if (err) {
          console.log(err);
          const signupError = err.toString().split(': ')[1];
          this.props.dispatch(loadError(signupError));
          return;
        }
        console.log('user name is ' + result.user.getUsername());
        console.log('call result: ' + result);
        // this.setState({ success: true });
        this.props.dispatch(jsonInfo(email, firstName, lastName, phone, gender));
      });
    }
  }

  _SignUp() {
    return (
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Center>
                <h5 style={{padding: '15px'}}>Sign Up to TinderTable</h5>
              </Center>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                <input className="form-control" type="text" placeholder="First Name" onChange={this.handleFirstNameChange}/>
                </div>
                <div className="form-group">
                <input className="form-control" type="text" placeholder="Last Name" onChange={this.handleLastNameChange}/>
                </div>
                <div className="form-group">
                <input className="form-control" type="text" placeholder="Email" onChange={this.handleEmailChange}/>
                </div>
                <div className="form-group">
                <input className="form-control" type="password" placeholder="password" onChange={this.handlePasswordChange}/>
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" placeholder="Gender" onChange={this.handleGenderChange}/>
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" placeholder="Phone Number" onChange={this.handlePhoneChange}/>
                </div>
                <div className="form-group">
                  <input className="form-control" type="text" placeholder="ZIP code" onChange={this.handleZipCodeChange}/>
                  <small className="form-text text-muted">ZipCode Optional</small>
                </div>
                <div className="form-group">
                <input className="form-control" type="date"/>
                  <small className="form-text text-muted">Birthday Optional</small>
                </div>
                {this.renderErrorMessage()}

                <Center>
                  <button style={btnStyle} className="btn btn-small" >Sign Up</button>
                </Center>
              </form>
              {/*{this.state.success &&(*/}
                {/*<Redirect to={"/dashboard"}/>*/}
              {/*)}*/}
            </div>

            <div className="col-md-6" style={topPadding}>
              <Center>
                <div style={testImage}></div>
              </Center>
            </div>

          </div>
        </div>
    )
  }

  render() {
    return (
      <div>
        <HeaderBasic
          linkLeft="/login"
          linkRight="/signup"
        />
        <div>
          {this._SignUp()}
        </div>
        {/*<div className="image">*/}
        {/*</div>*/}
      </div>
    )
  }
}

Signup.PropTypes = {
  errorMessage: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  errorMessage: state.identityState.errorMessage,
  body: state.identityState.body,
});

export default connect(mapStateToProps)(Signup);