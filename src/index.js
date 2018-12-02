import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import User from './User';
import Chat from './Chat';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route } from 'react-router-dom'

ReactDOM.render(
<HashRouter>
<div>
    <Route exact path="/" component={App}></Route>
    <Route exact path="/" component={User}></Route>
    <Route exact path="/chat" name="chat" component={Chat}></Route></div>
</HashRouter>, document.getElementById('root'));
registerServiceWorker();
