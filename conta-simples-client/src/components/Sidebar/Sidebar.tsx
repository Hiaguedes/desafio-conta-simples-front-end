import React from 'react';
import './Sidebar.css';
import {useParams, Link} from 'react-router-dom';
// sidebar (a barra lateral verde do lado esquerdo da página) é um componente comum a praticamente todas as páginas menos para o login, então separei ela das demais para ser reutilizada
interface Params {//interface dos parametros da requisição para saber o id, por conta dos links que vou fazer
    id: string;
}

interface CompanyInfo {//interface para os dados da empresa que precisaremos aqui
    nomeEmpresa: string;
    saldo: number;
}

function Sidebar({nomeEmpresa,saldo}: CompanyInfo) {// recebo os parametros dos elementos pais que buscarão e usarão eles aqui
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
                        <Link to={`/empresa/cards/${id}`} style={{textDecoration: 'none'}}><p className="sidebar_menu-item">Cartões</p></Link>
                    </div>
                </div>
            </aside>
    )

}

export default Sidebar;