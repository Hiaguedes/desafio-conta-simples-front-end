import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import LoginPage from './pages/LoginPage/LoginPage';
import CompanyProfile from './pages/CompanyProfile/CompanyProfile';
import ExtratoPage from './pages/ExtratoPage/ExtratoPage'

function Router(){

    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/" component={LoginPage}/>
                <Route  exact path="/empresa/:id" component={CompanyProfile}/>
                <Route  exact  path="/empresa/extrato/:id" component={ExtratoPage}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;
