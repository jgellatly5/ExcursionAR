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
            monthlyBudget: ''
        }
        this.monthlyBudget = 500;
        this.dailyBudget = 0;
        this.onChange = this.onChange.bind(this);
        // this.onBudget = this.onBudget.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
        this.lastScreen = this.lastScreen.bind(this);
        this.endScreen = this.endScreen.bind(this);
    }
    onChange(value) {
        let buttonNext = this.refs.buttonNext;
        this.dailyBudget = value;
        this.monthlyBudget = value * 30;
        console.log(this.monthlyBudget);
        if (value != 0) {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        } else {
            buttonNext.classList.remove('active', 'hvr-grow');
            buttonNext.setAttribute('disabled','disabled');
        }
    }
    onAfterChange() {
        let monthlyBudget = this.monthlyBudget;
        this.setState({
            monthlyBudget: monthlyBudget
        });
    }
    onUpdate(){
        return this.monthlyBudget;
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
                                    min={0}
                                    max={500}
                                    defaultValue={this.dailyBudget}
                                    tipFormatter={budgetFormatter}
                                    tipProps={{ overlayClassName: 'budgetTooltip', prefixCls: 'budgetTooltip' }}
                                    trackStyle={{ backgroundColor: '#1E1E75', height: 10 }}
                                    railStyle={{ backgroundColor: '#D8D8D8', height: 10 }}
                                    onChange={this.onChange}
                                    onAfterChange={this.onAfterChange}
                                    ref="slider"
                                    monthlyBudget={this.monthlyBudget}
                                    onBudget={this.onBudget}
                                />
                                <div className="min-and-max"><p className="min">$0</p><p className="max">$500</p></div>
                                <div className="month-est"><p>Around ${this.state.monthlyBudget} per month</p></div>
                                <hr className="budget" />
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
