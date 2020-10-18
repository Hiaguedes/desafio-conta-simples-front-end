import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import LoginPage from './pages/LoginPage/LoginPage';
import CompanyProfile from './pages/CompanyProfile/CompanyProfile';

function Router(){

    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/" component={LoginPage}/>
                <Route   path="/empresa/:id" component={CompanyProfile}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;
