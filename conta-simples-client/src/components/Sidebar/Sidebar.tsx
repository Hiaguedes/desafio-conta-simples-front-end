import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom'

interface Params {
    id: string;
}

interface CompanyInfo {
    nomeEmpresa: string;
    cnpj:string;
    saldo: number;
}

function CompanyProfile(){
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data)
        )},[id])

    if(!companyInfo) return <p>Empresa não encontrada error 404</p>
    return(
            <aside className="sidebar">
                <div className="sidebar_container">
                <h1 className="sidebar_title">Bem Vindo {companyInfo[0].nomeEmpresa}!</h1>
                    <p className="sidebar_balance_label">Seu saldo é de:</p>
                    <h2 className="sidebar_balance">R$ {companyInfo[0].saldo}</h2>
                </div>
            </aside>
    )

}

export default CompanyProfile;