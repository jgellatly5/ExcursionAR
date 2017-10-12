import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import App from './App';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

ReactDOM.render(
    <Routes history={browserHistory}/>,
    document.getElementById('root')
);
registerServiceWorker();
