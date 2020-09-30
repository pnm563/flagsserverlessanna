import React, { Component } from 'react';
import { API, Auth } from 'aws-amplify';
import theFlags from './flagData';
import LoadingOverlay from 'react-loading-overlay';

import { Button, Jumbotron } from 'react-bootstrap';

const apiName = 'devAPI';

class Utilities extends Component {

    constructor(props) {
        super(props);

        this.state = { isLoading: false };
        this.populateFlagDB = this.populateFlagDB.bind(this);
        this.buttonTest = this.buttonTest.bind(this);
        this.apiTest = this.apiTest.bind(this);

    }

    populateFlagDB() {
        this.setState({isLoading: true});
        theFlags.flags.forEach(async (f) => {
            
            await API.post(apiName, '/items', { body: f })
                .catch(error => console.log(error.response))
                .finally(() => {
                    this.setState({isLoading: false});
                });
            
            return true;
        });
        
    };

    buttonTest() {
        console.log('toggling overlay');
        this.setState({isLoading: !this.state.isLoading});
    };

    async apiTest() {
        console.log((await Auth.currentSession()).getIdToken().getJwtToken());
        API.post('devAPI','/thing')
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
        return <div><LoadingOverlay
                active={this.state.isLoading}
                spinner
                text='Posting...'>
                  <div>
                  <Jumbotron>
                      <h1>Welcome to Utilities</h1>
                      <p></p>
                <Button variant="primary" onClick={this.populateFlagDB}>Populate flag DB</Button>
                </Jumbotron>  </div>
                
        </LoadingOverlay>
        <Button onClick={() => this.buttonTest()}>Test overlay</Button>
        <Button onClick={() => this.apiTest()}>Test API</Button>
        </div>
    }
}

export default Utilities;