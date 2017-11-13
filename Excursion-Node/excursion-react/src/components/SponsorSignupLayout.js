import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Screen_1_0 from "./Screen_1_0";
import Screen_1_1 from "./Screen_1_1";

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScreenChange = this.handleScreenChange.bind(this);
        this.state = {
            screen: <Screen_1_0 key="0" handler={this.handleScreenChange}/>
        };
    }
    handleScreenChange(e) {
        e.preventDefault();
        this.setState({
            screen: <Screen_1_1 key="1" handler={this.handleScreenChange}/>
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
