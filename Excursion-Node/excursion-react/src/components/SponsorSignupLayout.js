import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// class SponsorSignupLayout extends Component {
//     render() {
//         const page = this.props.location.pathname.substr(1);
//     }
// }
const page = this.props.location.pathname.substr(1);

const SponsorSignupLayout = ({ children }) => (
    <div>
        <ReactCSSTransitionGroup
            transitionName="sponsor"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
        >
            {children, {key: page}}
        </ReactCSSTransitionGroup>
    </div>
);

export default SponsorSignupLayout;
