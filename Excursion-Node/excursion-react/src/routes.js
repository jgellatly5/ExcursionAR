import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './components/Home';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import Signup from './components/Signup';
import SponsorForm from './components/SponsorForm';
import SponsorForm_BusinessInformation from './components/SponsorForm_BusinessInformation';
import ChooseService from './components/ChooseService';
import Freemium_AdInfo from './components/Freemium_AdInfo';
import SetBudget from './components/SetBudget';
import AppLayout from './components/AppLayout';
import SponsorSignupLayout from './components/SponsorSignupLayout';

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
            <IndexRoute component={SponsorForm} />
            <Route component={SponsorForm_BusinessInformation} />
            <Route component={ChooseService} />
            <Route component={Freemium_AdInfo} />
        </Route>
        <Route path="/test" component={SetBudget} />
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
