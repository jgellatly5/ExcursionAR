import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './components/Home';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import Signup from './components/Signup';
import GeneralForm from './components/GeneralForm';
import SponsorForm_BusinessInformation from './components/SponsorForm_BusinessInformation';
// import ChooseService from './components/ChooseService'; //ChooseService component is unncessary until premium memberships are introduced
import Freemium_AdInfo from './components/Freemium_AdInfo';
import SetBudget from './components/SetBudget';
import ReviewInfo from './components/ReviewInfo';
import PaymentInfo from './components/PaymentInfo';
import PublisherForm_AppInfo from './components/PublisherForm_AppInfo';
import AppLayout from './components/AppLayout';
import SponsorSignupLayout from './components/SponsorSignupLayout';
import PublisherSignupLayout from './components/PublisherSignupLayout';

const Routes = (props) => (
    <Router history={browserHistory}>
        <Route path="/" component={AppLayout}>
            <IndexRoute component={Home} />
            <Route path="/getStarted" component={GetStarted} />
            <Route path="/learnMore" component={LearnMore} />
            <Route path="/contact" component={ContactForm} />
        </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/sponsor" component={SponsorSignupLayout}>
            <IndexRoute component={GeneralForm} />
            <Route component={SponsorForm_BusinessInformation} />
            {/*<Route component={ChooseService} /> //Not needed until further notice*/}
            <Route component={Freemium_AdInfo} />
            <Route component={SetBudget} />
            <Route component={ReviewInfo} />
            <Route component={PaymentInfo} />
        </Route>
        <Route path="/publisher" component={PublisherSignupLayout}>
            <IndexRoute component={GeneralForm} />
            <Route component={PublisherForm_AppInfo} />
        </Route>
        <Route path="/test" component={PublisherForm_AppInfo} />
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
