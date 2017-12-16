import React, { Component } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import Slider, { Range, createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

function budgetFormatter(v) {
    return `$${v} per day`;
}

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
        let buttonNext = this.refs.buttonNext;
        if (buttonNext) {
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
        const SliderWithTooltip = createSliderWithTooltip(Slider);
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
                                <SliderWithTooltip
                                    tipFormatter={budgetFormatter}
                                    tipProps={{ overlayClassName: 'budgetTooltip', prefixCls: 'budgetTooltip' }}
                                    defaultValue={30}
                                    trackStyle={{ backgroundColor: '#1E1E75', height: 10 }}
                                    railStyle={{ backgroundColor: '#D8D8D8', height: 10 }}
                                    onChange={this.onChange}
                                />
                                <div className="min-and-max"><p className="min">$0</p><p className="max">$5000</p></div>
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
