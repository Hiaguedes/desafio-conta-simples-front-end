import React from 'react';
import './LoginPage.css';

function LoginPage() {

    return (
        <main className="login_container">
            <form  className="login_form">
                <h2 className="login_title">Login</h2>
                <input className="login_input" type="text" placeholder="Coloque o CNPJ"/>
                <button className="login_button" type="button">Entrar na conta</button>
            </form>
        </main>
    )
}

export default LoginPage;