import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SponsorForm from "./SponsorForm";
import SponsorForm_BusinessInformation from "./SponsorForm_BusinessInformation";
import ChooseService from './ChooseService';
import Freemium_AdInfo from './Freemium_AdInfo';
import SetBudget from './SetBudget';
import ReviewInfo from './ReviewInfo';

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
    handleScreenChange(e, newScreen, firstName, lastName, email, companyName, industry, phoneNumber, website, adName, genre, adFormat, dailyBudget, monthlyBudget) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            firstName: firstName,
            lastName: lastName,
            email: email,
            companyName: companyName,
            industry: industry,
            phoneNumber: phoneNumber,
            website: website,
            adName: adName,
            genre: genre,
            adFormat: adFormat,
            dailyBudget: dailyBudget,
            monthlyBudget: monthlyBudget
        });
    }
    render() {
        let child;
        switch(this.state.screen) {
            case 0:
                if (this.state.isScreenChanging) {
                    child = <SponsorForm
                                screenId={this.state.screen}
                                handler={this.handleScreenChange}
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
                }
                break;
            case 1:
                child = <SponsorForm_BusinessInformation
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
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
            // This case will be released when sponsor can choose between freemium or premium membership
            // case 2:
            //     child = <ChooseService screenId={this.state.screen} handler={this.handleScreenChange}/>;
            //     break;
            case 2:
                child = <Freemium_AdInfo
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
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
                            monthlyBudget={this.state.monthlyBudget}
                        />;
                break;
            case 3:
                child = <SetBudget
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
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
                            monthlyBudget={this.state.monthlyBudget}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
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
