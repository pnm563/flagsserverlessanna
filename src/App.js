import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify, { API, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';

const signUpConfig = {
  header: 'Sign up',
  hiddenDefaults: ['username', 'phone_number'],
};

class TestButton extends Component {
  constructor(props) {
    super(props);
  }

  async apiTest() {
    //console.log((await Auth.currentSession()).getIdToken().getJwtToken());
    await API.get('devAPI', '/thing')
      .then(response => {
        console.log(response);

      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        console.log("complete");
      }
      );

  }



  render() {
    return <button onClick={() => this.apiTest()}>Click for API goodness</button>
  }

};

class SignOutButton extends Component {
  constructor(props) {
    super(props);
  }

  signOut()
  {
    Auth.signOut();
  }

  render() {
    return <button onClick={() => this.signOut()}>Sign out NOW!</button>
  }
}


function App() {
  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <TestButton></TestButton>
        <SignOutButton></SignOutButton>
      </header>

    </div>

  );
}

Amplify.configure({
  // OPTIONAL - if your API requires authentication 
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    //identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',
    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-2_0J4FpZYXK',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2gs7n3dtsaltaoi8631sa3panh',
  },
  API: {
    endpoints: [
      {
        name: "devAPI",
        endpoint: "https://um97twam5a.execute-api.eu-west-2.amazonaws.com/Prod/",
        custom_header: async () => {
          return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      },
      {
        name: "MyCustomCloudFrontApi",
        endpoint: "https://api.my-custom-cloudfront-domain.com",

      }
    ]
  }
});

export default withAuthenticator(App, {
  usernameAttributes: 'email',
  signUpConfig: signUpConfig,
  //includeGreetings: true
});
