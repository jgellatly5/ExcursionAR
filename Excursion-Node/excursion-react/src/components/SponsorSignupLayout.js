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
            screen: <Screen_1_0 key="0" handler={this.handleScreenChange}/>
        };
    }
    handleScreenChange(e, num) {
        console.log("Handler being called already");
        console.log(num);
        e.preventDefault();
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
        // const children = this.props.children;
        // const screen = <Screen_1_0 />;
        // const names = ['Jake', 'Jon', 'Thruster'];
        return(
            <div>
                <ReactCSSTransitionGroup
                    transitionName="sponsor"
                    transitionEnterTimeout={2000}
                    transitionLeaveTimeout={2000}
                >
                    {this.state.screen}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default SponsorSignupLayout;
