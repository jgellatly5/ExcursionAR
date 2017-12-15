import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

class SetBudget extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onChange = this.onChange.bind(this);
        this.lastScreen = this.lastScreen.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        let buttonNext = this.refs.buttonNext;
        let adName = this.adNameInput.value;
        let genre = this.genreInput.value;
        let outdoorEnv = this.outdoorEnvInput.value;
        let indoorEnv = this.indoorEnvInput.value;
        let adFormat = this.state.adFormat;
        if (adName !== '' && genre !== '' && (indoorEnv !== '' || outdoorEnv !== '') && adFormat !== '') {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    lastScreen(e) {
        let nextScreen = this.props.screenId - 1;
        this.props.handler(e, nextScreen);
    }
    endScreen(e) {
        let nextScreen = this.props.screenId + 1;
        this.props.handler(e, nextScreen);
    }
    componentDidMount() {
        let buttonNext = this.refs.buttonNext;
        buttonNext.setAttribute('disabled','disabled');
    }
    render() {
        return (
            <div className="ad-signup-container">
                <div className="ad-signup" id="fix-padding">
                    <Panel className="set-budget-panel">
                    <h1>Tell us your budget</h1>
                    <p>Set the amount you would like to spend.</p>
                    <div>
                        <form>
                            <div className="form-group">
                                <label className="control-label">Budget Amount</label>
                                <Slider />
                                <p className="ad-type">$0</p>
                            </div>
                        </form>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" onClick={this.lastScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="buttonNext" onClick={this.endScreen}>
                                Next
                            </button>
                        </div>
                    </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default SetBudget;
