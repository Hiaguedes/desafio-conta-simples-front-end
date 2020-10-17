import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import LoginPage from './pages/LoginPage/LoginPage';

function Router(){

    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/" component={LoginPage}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;
