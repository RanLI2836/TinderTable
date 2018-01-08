import React, { Component, PropTypes } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'
import Center from 'react-center';
import { connect } from 'react-redux';

import appConfig from './config';
import { HeaderBasic } from '../component/Header';
import {
  loadError,
  storeToken,
  storeId,
} from '../action/identity';
import { Link } from 'react-router';

const testImage = {
    backgroundImage: "url('../../image/signinImg.png')",
  backgroundSize:"cover",
    width: 300,
    height: 300,
    borderRadius: 150
};
const topPadding = {
    paddingTop: '80px'
};
const btnStyle = {
    color:'#fff',
    backgroundColor: '#ed8b9e'
};

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this._handleEmailChange = this._handleEmailChange.bind(this);
    this._handlePasswordChange = this._handlePasswordChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderErrorMessage =  this._renderErrorMessage.bind(this);
    this._redirect = this._redirect.bind(this);
    this._signIn = this._signIn.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadError(''));
  }

  _handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  _handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  _handleSubmit(e) {
    const { email } = this.state;
    this.props.dispatch(loadError(''));
    e.preventDefault();
    const id = this.state.email.trim();
    const password = this.state.password.trim();
    const authDetails = new AuthenticationDetails({
      Username: id,
      Password: password
    });
    const userData = {
      Username: id,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: result => {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        const token = result.getAccessToken().getJwtToken();

        AWS.config.region = 'us-east-1';

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId : 'us-east-1:06f9f0eb-b0d4-4cd5-9492-3d1f58873a6d', // your identity pool id here
          Logins : {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_fwmC3MZP3' : result.getIdToken().getJwtToken()
          }
        });

        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
          if (error) {
            console.error(error);
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!');
            const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;
            const awsCredentials = {
              accessKeyId,
              secretAccessKey,
              sessionToken
            };
            console.log(awsCredentials);
            sessionStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
            sessionStorage.setItem('isLoggedIn', true);
          }
        });

        this.props.dispatch(storeToken(token));
        this.props.dispatch(storeId(email));
        this._redirect();
        // callback(null, result)
      },
      onFailure: err => {
        // callback(err)
        console.log(err.toString().split(': ')[1]);
        const error = err.toString().split(': ')[1];
        this.props.dispatch(loadError(error));

      }
    })
  };

  _redirect() {
    console.log("redirect");
    this.props.history.push('/dashboard');
    return (
      <Link to="dashboard"/>
    )
  }

  _renderErrorMessage() {                                           // if there is any info missing, render the corresponding error
    return (
      <div>
        <p>{this.props.errorMessage}</p>
      </div>
    )
  }


  _signIn() {
    return (
      <div className="container">
          <div className="row" style={topPadding}>
              <div className="col-md-6">
                  <Center>
                      <h5 style={{padding: '10px'}}>Sign in to TinderTable</h5>
                  </Center>
                <form onSubmit={this._handleSubmit}>
                    <div className="form-group">
                        <input className="form-control" type="text" placeholder="Email" onChange={this._handleEmailChange}/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="password" placeholder="Password" onChange={this._handlePasswordChange}/>
                    </div>
                    <Center style={{padding: '10px'}} >
                        <input style={btnStyle} className="btn btn-small" type="submit" value="Sign In"/>
                    </Center>
                </form>
                {this._renderErrorMessage()}
              </div>

              <div className="col-md-6">
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
          {this._signIn()}
        </div>
        <div>

        </div>
      </div>
    )
  }
}

Login.PropTypes = {
  errorMessage: PropTypes.string.isRequired,
};

const mapStateToProps = (state) =>({
  errorMessage: state.identityState.errorMessage,
});

export default connect(mapStateToProps)(Login);