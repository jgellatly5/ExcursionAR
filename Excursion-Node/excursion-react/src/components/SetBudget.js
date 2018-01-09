import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

function budgetFormatter(v) {
    return `$${v} per day`;
}

class SetBudget extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lastScreen: 2,
            nextScreen: 4
        }
        this.monthlyBudget = this.props.monthlyBudget;
        this.dailyBudget = this.props.dailyBudget;
        this.onChange = this.onChange.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
    }
    onChange(value) {
        let buttonNext = this.refs.buttonNext;
        this.dailyBudget = value;
        this.monthlyBudget = value * 30;
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
        let dailyBudget = this.dailyBudget;
        this.setState({
            monthlyBudget: monthlyBudget,
            dailyBudget: dailyBudget
        });
    }
    changeScreen(e) {
        e.preventDefault();
        if (e.target.name == 'back') {
            this.props.handlerBack({...this.state});
        } else {
            this.props.handlerForward({...this.state});
        }
    }
    componentDidMount() {
        let buttonNext = this.refs.buttonNext;
        if (this.dailyBudget == undefined) {
            buttonNext.setAttribute('disabled','disabled');
        } else {
            buttonNext.classList.add('active', 'hvr-grow');
            buttonNext.removeAttribute('disabled');
        }
    }
    render() {
        const SliderWithTooltip = createSliderWithTooltip(Slider);
        return (
            <div className="ad-signup-container">
                <div className="ad-signup" id="fix-padding">
                    <Panel className="set-budget-panel">
                        <div className="fix-margin">
                            <h1>Tell us your budget</h1>
                            <p>Set the amount you would like to spend.</p>
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
                                    />
                                    <div className="min-and-max"><p className="min">$0</p><p className="max">$500</p></div>
                                    {/*TODO: Monthly budget text should update reactively like daily budget slider*/}
                                    <div className="month-est hvr-underline-from-left-blue"><p>Around ${this.monthlyBudget} per month</p></div>
                                </div>
                            </form>
                        </div>
                        <div className="bottom-form">
                            <button className="btn btn-lg back hvr-grow" ref="buttonBack" name="back" onClick={this.changeScreen}>
                                Back
                            </button>
                            <button className="btn btn-lg next" ref="buttonNext" name="next" onClick={this.changeScreen}>
                                Next
                            </button>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
};

export default SetBudget;
