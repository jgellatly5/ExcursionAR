import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Screen_1_0 from "./Screen_1_0";
import Screen_1_1 from "./Screen_1_1";
import Screen_1_2 from "./Screen_1_2";

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScreenChange = this.handleScreenChange.bind(this);
        this.state = {
            screen: <Screen_1_0 key="0" handler={this.handleScreenChange}/>,
            isScreenChanging: false
        };
    }
    componentDidMount() {
        this.setState({
            isScreenChanging: true
        });
    }
    // componentDidUpdate(prevProps, prevState) {
    //     // if (prevState == this.state.isScreenChanging) {
    //     //     child = this.state.screen;
    //     // }
    //     console.log("Before - isScreenChanging: " + this.state.isScreenChanging);
    //     if (!this.state.isScreenChanging) {
    //         this.setState({
    //             isScreenChanging: true
    //         });
    //     }
    //     console.log("After - isScreenChanging: " + this.state.isScreenChanging);
    //     console.log("Component is updating");
    // }
    handleScreenChange(e, num) {
        e.preventDefault();
        // Uncommenting causes the full animation to work for one slide, but does not let other slides appear
        // this.setState({ isScreenChanging: false });
        let newScreen = "";
        switch(num) {
            case 1:
                newScreen = <Screen_1_1 key={num} handler={this.handleScreenChange}/>;
                break;
            case 2:
                newScreen = <Screen_1_2 key={num} handler={this.handleScreenChange}/>;
                break;
            default:
                break;
        }
        this.setState({
            screen: newScreen
        });
    }
    render() {
        let child;
        if (this.state.isScreenChanging) {
            child = this.state.screen;
        }
        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="sponsor"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={2000}
                >
                    {child}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default SponsorSignupLayout;
