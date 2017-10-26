/* Copyright G. Hemingway, 2017 - All rights reserved */
"use strict";

// Necessary modules
import React, { Component }     from 'react';
import { render }               from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }  from 'react-router'
import { Ad }                   from './components/ad/ad';
import { Container }            from './components/container'
import { Setup }                from './components/setup';

// Bring bootstrap into the picture
require('./app.css');

/*************************************************************************/

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {this.props.children}
        </div>;
    }
}

class User {
    constructor() {
        // See if user is in localStorage
        const data = localStorage.getItem('parameters');
        this.data = data ? JSON.parse(data) : {
            worker_id: "",
            assignment_id: "",
            hid_id: ""
        };
    }

    start(data) {
        // Store locally
        this.data = data;
        // Store into localStorage
        localStorage.setItem('parameters', JSON.stringify(data));
        // Go to user profile
    }

    // called with data submission
    exit() {
        // Wipe localStorage
        localStorage.removeItem('parameters');
    }

    getParameters() {
        return this.data;
    }
}
let user = new User();

render(
    <Router history={browserHistory}>
        <Route path="/" component={App} user={user}>
            <Route path="/ad" component={Ad}/>
            <Route path="/exp" component={Container} type="experiment"/>
            <Route path="/preview" component={Container} type="preview"/>
            <Route path="/setup" component={Setup}/>
        </Route>
    </Router>,
    document.getElementById('main')
);
