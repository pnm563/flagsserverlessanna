import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Container, Navbar, Nav } from 'react-bootstrap';


// Components
import FlagBrowser from './flagBrowser';
import Home from './home';
import Utilities from './utilities';
import Quiz from './quiz';

import Amplify, { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import '@aws-amplify/ui/dist/style.css';
import './App.css';

const signUpConfig = {
  header: 'Sign up',
  hiddenDefaults: ['username', 'phone_number'],
};

class App extends Component {

  constructor(props) {
    super(props);
    
  }

  signOut() {
    Auth.signOut();
  }

  render() {
    return (
      <Router>
        <Container>
          <Navbar expand="lg" bg="#aa3344">
            <Navbar.Brand href="/">Flags Of The World</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav.Link disabled>
                Welcome, {this.props.authData.username}
              </Nav.Link>
              <Navbar.Text>
                <Link to="/">
                  Home
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/browse">
                  Browse
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/utilities">
                  Utilities
                </Link>
              </Navbar.Text>
              <Navbar.Text>
                <Link to="/quiz">
                  Quiz
                </Link>
              </Navbar.Text>

              <Navbar.Text>
                <Link to="" onClick={this.signOut}>Sign out</Link>
              </Navbar.Text>


            </Navbar.Collapse>
          </Navbar>
          <br></br>
          <Switch>
            <Route exact path="/">
              <Home username={this.props.authData.username} />
            </Route>
            <Route path="/browse">
              <FlagBrowser />
            </Route>
            <Route path="/utilities">
              <Utilities />
            </Route>
            <Route path="/quiz">
              <Quiz />
            </Route>
          </Switch>
        </Container>
      </Router>
    );
  }
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

      },
      {
        name: "localAPI",
        endpoint: "http://localhost:3000",
        custom_header: async () => {
          return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
      },
    ]
  }
});

export default withAuthenticator(App, {
  usernameAttributes: 'email',
  signUpConfig: signUpConfig,
  //includeGreetings: true
});
