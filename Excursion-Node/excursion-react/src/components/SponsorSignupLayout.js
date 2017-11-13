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
    handleScreenChange(e, num) {
        e.preventDefault();
        this.setState({ mounted: false, newMounted: true })
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
        if (this.state.mounted) {
            child = this.state.screen;
        } else if (this.state.newMounted) {
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
