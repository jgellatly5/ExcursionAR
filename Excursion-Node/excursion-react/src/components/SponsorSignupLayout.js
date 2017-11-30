import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SponsorForm from "./SponsorForm";
import SponsorForm_2 from "./SponsorForm_2";

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleScreenChange = this.handleScreenChange.bind(this);
        this.state = {
            screen: <SponsorForm key="0" handler={this.handleScreenChange}/>,
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
        console.log(num);
        switch(num) {
            case 1:
                newScreen = <SponsorForm_2 key={num} handler={this.handleScreenChange}/>;
                break;
            default:
                break;
        }
        this.setState({
            screen: newScreen
        });
    }
    render() {
        // let child = this.props.children;
        // let child = this.handleScreenChange;
        // let segment = "0";
        // let SponsorForm = <SponsorForm key="0" handler={this.handleScreenChange}/>
        let child;
        if (this.state.isScreenChanging) {
            child = this.state.screen;
            // child = this.refs.currentScreen;
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
