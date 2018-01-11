import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GeneralForm from "./GeneralForm";
import PublisherForm_AppInfo from "./PublisherForm_AppInfo";

const screenChoiceEnum = {
    GENERAL_FORM: 0,
    PUBLISHER_FORM_APP_INFO: 1
}
Object.freeze(screenChoiceEnum);

class PublisherSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleLastScreen = this.handleLastScreen.bind(this);
        this.handleNextScreen = this.handleNextScreen.bind(this);
        this.handleGeneralFormState = this.handleGeneralFormState.bind(this);
        this.handlePublisherFormAppInfoState = this.handlePublisherFormAppInfoState.bind(this);
        this.state = {
            screen: 0,
            isScreenChanging: false
        };
    }
    componentDidMount() {
        this.setState({ isScreenChanging: true });
    }
    handleLastScreen(screen) {
        this.setState({ screen: screen });
    }
    handleNextScreen(screen) {
        this.setState({ screen: screen });
    }
    handleGeneralFormState(publisher_form) {
        const {firstName, lastName, email} = publisher_form;
        this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email
        });
    }
    handlePublisherFormAppInfoState(publisher_form) {

    }
    render() {
        let child;
        const {
            firstName, lastName, email
        } = this.state;
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <GeneralForm
                                handler={this.handleGeneralFormState}
                                handleNextScreen={this.handleNextScreen}
                                nextScreen={screenChoiceEnum.PUBLISHER_FORM_APP_INFO}
                                firstName={firstName}
                                lastName={lastName}
                                email={email}
                            />;
                }
                break;
            case 1:
                child = <PublisherForm_AppInfo
                            handler={this.handlePublisherFormAppInfoState}
                            handleLastScreen={this.handleLastScreen}
                            handleNextScreen={this.handleNextScreen}
                            lastScreen={screenChoiceEnum.GENERAL_FORM}
                        />;
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

export default PublisherSignupLayout;
