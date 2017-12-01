import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SponsorForm from "./SponsorForm";
import SponsorForm_2 from "./SponsorForm_2";

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScreenChange = this.handleScreenChange.bind(this);
        this.state = {
            screen: 0,
            isScreenChanging: false
        };
    }
    componentDidMount() {
        this.setState({
            isScreenChanging: true
        });
    }
    handleScreenChange(e, num) {
        e.preventDefault();
        // Uncommenting causes the full animation to work for one slide, but does not let other slides appear
        this.setState({ isScreenChanging: false });
        let newScreen;
        switch(num) {
            case 1:
                newScreen = num;
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
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <SponsorForm key={this.state.screen} handler={this.handleScreenChange}/>;
                }
                break;
            case 1:
                child = <SponsorForm_2 key={this.state.screen} handler={this.handleScreenChange}/>;
                break;
            default:
                break;
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
