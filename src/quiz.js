import React, { Component } from 'react';
import { API } from 'aws-amplify';
import LoadingOverlay from 'react-loading-overlay';
import { CardColumns, Card, Alert, Jumbotron } from 'react-bootstrap';

const apiName = 'devAPI';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class Quiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flagData: [],
            isLoading: false,
            answers: [],
            question: null,
            showAnswers: false,
            selectedAnswer: null
        };

        this.getQuestion = this.getQuestion.bind(this);
        this.questionClick = this.questionClick.bind(this);
    }

    getFlags = async () => {
        console.log("getting flags");
        this.setState({ isLoading: true });

        await API.get(apiName, '/items')
            .then(response => {
                this.setState({ flagData: response.items });
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                console.log("finished getting flags");
                this.setState({ isLoading: false });
            }
            );


    };

    getQuestion = () => {
        this.setState({
            answered: false,
            showAnswers: false,
            selectedAnswer: null
        });

        let totalFlags = this.state.flagData.length;

        let randomFlag1;
        let randomFlag2;
        let nextFlag;

        do {
            randomFlag1 = getRndInteger(1, totalFlags);
            randomFlag2 = getRndInteger(1, totalFlags);
            nextFlag = getRndInteger(1, totalFlags);
        }
        while (randomFlag1 === randomFlag2 ||
            (nextFlag === randomFlag1 || nextFlag === randomFlag2)
        );

        let answers = [randomFlag1, randomFlag2, nextFlag];

        shuffle(answers);

        this.setState({
            answers: answers,
            question: this.state.flagData[nextFlag].Description,
            correctAnswer: this.state.flagData[nextFlag].IndexNo
        });

    };

    questionClick = flagIndexNo => {
        console.log(this.state);

        if (this.state.answered) {
            this.getQuestion();
        }
        else {
            if (flagIndexNo === this.state.correctAnswer) {
                this.setState({ outcomeVariant: 'success', outcomeText: ' - Correct!' });
            }
            else {
                this.setState({ outcomeVariant: 'danger', outcomeText: ' - Incorrect!' });
            }
            this.setState({
                answered: true,
                showAnswers: true,
                selectedAnswer: flagIndexNo
            });
        }

    };

    async componentDidMount() {
        await this.getFlags();
        this.getQuestion();
    }

    render() {

        return <div>
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text='Please wait...'>
                <Jumbotron>
                    <Alert variant="info"
                        onClick={this.getQuestion}>
                        Please click the flag of {this.state.question}
                    </Alert>
                    <CardColumns>
                        {this.state.answers.map(flag => (
                            <Card key={this.state.flagData[flag].ID}
                                className="text-center"
                                border={this.state.flagData[flag].IndexNo === this.state.selectedAnswer ? 'dark' : 'none'}
                                onClick={() => { this.questionClick(this.state.flagData[flag].IndexNo) }}>
                                <Card.Img variant="top" alt="" src={`https://flagsoftheworldimages.s3.eu-west-2.amazonaws.com/${this.state.flagData[flag].ID}.png`}>
                                </Card.Img>

                                {(this.state.showAnswers) &&
                                    <Card.Footer 
                                        className={this.state.flagData[flag].IndexNo === this.state.correctAnswer ? "correctFooter" : "incorrectFooter"}>
                                        <Card.Text>
                                            {this.state.flagData[flag].Description}
                                            {this.state.flagData[flag].IndexNo === this.state.selectedAnswer ? 
                                                this.state.flagData[flag].IndexNo === this.state.correctAnswer ? " - Correct!" : " - Incorrect!" : ""}
                                        </Card.Text>
                                    </Card.Footer>}

                            </Card>))}

                    </CardColumns>

                </Jumbotron>

            </LoadingOverlay>

        </div>
    }

}

export default Quiz;