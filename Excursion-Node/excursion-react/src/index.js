import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { browserHistory } from 'react-router';
import App from './App';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Routes history={browserHistory}/>,
    document.getElementById('root')
);
registerServiceWorker();
