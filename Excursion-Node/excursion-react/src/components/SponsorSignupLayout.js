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
            mounted: false,
            newMounted: false
        };
    }
    componentDidMount() {
        this.setState({
            mounted: true
        });
    }
    componentWillUnmount() {
        this.setState({
            newMounted: true
        });
    }
    handleScreenChange(e, num) {
        e.preventDefault();
        // Uncommenting causes the full animation to work for one slide, but does not let other slides appear
        // this.setState({ mounted: false });
        let newScreen = "";
        console.log("The input was " + num);
        switch(num) {
            case 1:
                newScreen = <Screen_1_1 key={num} handler={this.handleScreenChange}/>;
                console.log("We are in the switch and the input was " + num);
                console.log(newScreen);
                break;
            case 2:
                newScreen = <Screen_1_2 key={num} handler={this.handleScreenChange}/>;
                break;
            default:
                break;
        }
        this.setState({
            screen: newScreen,
            mounted: false
        }, function() {
            this.render;
            console.log("Calling this.render");
        });
        console.log("we are in handleScreenChange function");
        console.log(this.state.screen);
        console.log(this.state.mounted);
    }
    render() {
        let child;
        if (this.state.mounted) {
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
