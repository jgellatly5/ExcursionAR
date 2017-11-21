import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './components/Home';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import Signup from './components/Signup';
import SponsorForm from './components/SponsorForm';
import AppLayout from './components/AppLayout';

const Routes = (props) => (
    <Router history={browserHistory}>
        <Route path="/" component={AppLayout}>
            <IndexRoute path="/" component={Home} />
            <Route path="/getStarted" component={GetStarted} />
            <Route path="/learnMore" component={LearnMore} />
            <Route path="/contact" component={ContactForm} />
        </Route>
        <Route path="/signup" component={Signup} />
        <Route path="/sponsor" component={SponsorForm} />
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
