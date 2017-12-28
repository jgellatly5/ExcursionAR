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
            isScreenChanging: false,
            name: '',
            email: '',
            companyName: '',
            adName: '',
            genre: '',
            adFormat: '',
            dailyBudget: 0
        };
    }
    componentDidMount() {
        this.setState({
            isScreenChanging: true
        });
    }
    handleScreenChange(e, newScreen, name, email, companyName, industry, phoneNumber, website, adName, genre, adFormat, dailyBudget) {
        e.preventDefault();
        this.setState({
            screen: newScreen,
            name: name,
            email: email,
            companyName: companyName,
            industry: industry,
            phoneNumber: phoneNumber,
            website: website,
            adName: adName,
            genre: genre,
            adFormat: adFormat,
            dailyBudget: dailyBudget
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
                            />;
                }
                break;
            case 1:
                child = <SponsorForm_BusinessInformation
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
                            name={this.state.name}
                            email={this.state.email}
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
                            name={this.state.name}
                            email={this.state.email}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                        />;
                break;
            case 3:
                child = <SetBudget
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
                            name={this.state.name}
                            email={this.state.email}
                            companyName={this.state.companyName}
                            industry={this.state.industry}
                            phoneNumber={this.state.phoneNumber}
                            website={this.state.website}
                            adName={this.state.adName}
                            genre={this.state.genre}
                            adFormat={this.state.adFormat}
                        />;
                break;
            case 4:
                child = <ReviewInfo
                            screenId={this.state.screen}
                            handler={this.handleScreenChange}
                            name={this.state.name}
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
