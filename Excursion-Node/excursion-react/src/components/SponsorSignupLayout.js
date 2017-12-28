import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SponsorForm from "./SponsorForm";
import SponsorForm_BusinessInformation from "./SponsorForm_BusinessInformation";
// import ChooseService from './ChooseService'; Not necessary until premium version is offered
import Freemium_AdInfo from './Freemium_AdInfo';
import SetBudget from './SetBudget';
import ReviewInfo from './ReviewInfo';

class SponsorSignupLayout extends Component {
    constructor(props) {
        super(props);
        this.handleSponsorFormState = this.handleSponsorFormState.bind(this);
        this.handleSponsorFormBusinessInfoState = this.handleSponsorFormBusinessInfoState.bind(this);
        this.handleFreemiumAdInfoState = this.handleFreemiumAdInfoState.bind(this);
        this.handleSetBudgetState = this.handleSetBudgetState.bind(this);
        this.handleReviewInfoState = this.handleReviewInfoState.bind(this);
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
    handleSponsorFormState(e, newScreen, firstName, lastName, email) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            firstName: firstName,
            lastName: lastName,
            email: email
        });
    }
    handleSponsorFormBusinessInfoState(e, newScreen, companyName, industry, phoneNumber, website) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            companyName: companyName,
            industry: industry,
            phoneNumber: phoneNumber,
            website: website
        });
    }
    handleFreemiumAdInfoState(e, newScreen, adName, genre, adFormat) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            adName: adName,
            genre: genre,
            adFormat: adFormat
        });
    }
    handleSetBudgetState(e, newScreen, dailyBudget, monthlyBudget) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            dailyBudget: dailyBudget,
            monthlyBudget: monthlyBudget
        });
    }
    handleReviewInfoState(e, newScreen) {
        e.preventDefault();
        this.setState({
            screen: newScreen
        });
    }
    render() {
        let child;
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <SponsorForm
                                screenId={this.state.screen}
                                handler={this.handleSponsorFormState}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                email={this.state.email}
                            />;
                }
                break;
            case 1:
                child = <SponsorForm_BusinessInformation
                            screenId={this.state.screen}
                            handler={this.handleSponsorFormBusinessInfoState}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                        />;
                break;
            // This case will be released when sponsor can choose between freemium or premium membership
            // case 2:
            //     child = <ChooseService screenId={this.state.screen} handler={this.handleScreenChange}/>;
            //     break;
            case 2:
                child = <Freemium_AdInfo
                            screenId={this.state.screen}
                            handler={this.handleFreemiumAdInfoState}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                        />;
                break;
            case 3:
                child = <SetBudget
                            screenId={this.state.screen}
                            handler={this.handleSetBudgetState}
                            dailyBudget={this.state.dailyBudget}
                            monthlyBudget={this.state.monthlyBudget}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            screenId={this.state.screen}
                            handler={this.handleReviewInfoState}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            email={this.state.email}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                            dailyBudget={this.state.dailyBudget}
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

export default SponsorSignupLayout;
