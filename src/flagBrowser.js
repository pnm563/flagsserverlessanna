import React, { Component } from 'react';
import { Card, CardColumns } from 'react-bootstrap';
import { API } from 'aws-amplify';
import LoadingOverlay from 'react-loading-overlay';

const apiName = 'api7c7341e9';


class FlagBrowser extends Component {
    constructor(props) {
        super(props);

        this.state = {  flags: [], 
                         isLoading: false};
    }

    getFlags = async () => {
        console.log('calling api');

        this.setState({isLoading: true});

        await API.get(apiName, '/items')
            .then(response => {
                console.log(response);
                this.setState({ flags: response.items});
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.setState({isLoading: false});
            }
            );
    };

    async componentDidMount() {
        await this.getFlags();
    }


    render() {
        
        
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text='Please wait...'>
                <div style={{ height: "500px", overflowY: "scroll" }}>
                    <CardColumns>
                        {this.state.flags.map(flag => (
                            <Card key={flag.ID} border="dark">
                                <Card.Img variant="top" alt="" src={`https://flagsoftheworldimages.s3.eu-west-2.amazonaws.com/${flag.ID}.png`}>
                                </Card.Img>
                                <Card.Footer>
                                    <Card.Text>
                                        {flag.Description}
                                    </Card.Text>
                                </Card.Footer>
                            </Card>))}
                    </CardColumns>
                </div>
            </LoadingOverlay>
        )
    }
}

export default FlagBrowser;