import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import Home from './components/Home';
import TempSignup from './components/TempSignup';
import NotFound from './components/NotFound';
import GetStarted from './components/GetStarted';
import LearnMore from './components/LearnMore';
import ContactForm from './components/ContactForm';
import Screen_1_0 from './components/Screen_1_0';
import AppLayout from './components/AppLayout';

const Routes = (props) => (
    <Router history={browserHistory}>
        <Route path="/" component={AppLayout}>
            <IndexRoute path="/" component={Home} />
            <Route path="/getStarted" component={GetStarted} />
            <Route path="/learnMore" component={LearnMore} />
            <Route path="/contact" component={ContactForm} />
            <Route path="/signup" component={TempSignup} />
            <Route path="/screen_1_0" component={Screen_1_0} />
        </Route>
        <Route path="*" component={NotFound} />
    </Router>
);

export default Routes;
