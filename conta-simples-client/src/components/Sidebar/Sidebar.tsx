import React from 'react';
import './Sidebar.css';
import {useParams, Link} from 'react-router-dom';

interface Params {
    id: string;
}

interface CompanyInfo {
    nomeEmpresa: string;
    saldo: number;
}

function Sidebar({nomeEmpresa,saldo}: CompanyInfo) {
    const params = useParams<Params>();
    const {id} = params;

    return(
            <aside className="sidebar">
                <div className="sidebar_container">
                <h1 className="sidebar_title">Bem Vindo <br/> {nomeEmpresa}!</h1>
                    <p className="sidebar_balance_label">Seu saldo é de:</p>
                    <h2 className="sidebar_balance">R$ {saldo}</h2>
                    <div className="sidebar_menu">
                        <Link to={`/empresa/${id}`} style={{textDecoration: 'none'}}><p className="sidebar_menu-item">Home</p></Link>
                        <Link to={`/empresa/extrato/${id}`} style={{textDecoration: 'none'}}><p className="sidebar_menu-item">Visualizar Extrato</p></Link>
                    </div>
                </div>
            </aside>
    )

}

export default Sidebar;