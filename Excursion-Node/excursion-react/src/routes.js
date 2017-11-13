import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './components/Home';
import TempSignup from './components/TempSignup';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import AppLayout from './components/AppLayout';
import SponsorSignupLayout from './components/SponsorSignupLayout';

const Routes = (props) => (
    <Router history={browserHistory}>
        <Route path="/" component={AppLayout}>
            <IndexRoute component={Home} />
            <Route path="/getStarted" component={GetStarted} />
            <Route path="/learnMore" component={LearnMore} />
            <Route path="/contact" component={ContactForm} />
            <Route path="/signup" component={TempSignup} />
        </Route>
        <Route path="/sponsor" component={SponsorSignupLayout} />
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
