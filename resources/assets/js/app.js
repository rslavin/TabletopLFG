require('./bootstrap');

import React, {Component} from 'react';
import {render} from 'react-dom';
// Import routing components
import {Router, Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import store from './store'

// Import custom components
import AppContainer from './containers/AppContainer';

if (document.getElementById('content-container')) {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <AppContainer title={store.title}/>
            </BrowserRouter>
        </Provider>,
        document.getElementById('content-container')
    );
}