import React, { useEffect, useState } from 'react';
import './CompanyProfile.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

interface Params {
    id: string;
}

interface CompanyInfo {
    nomeEmpresa: string;
    cnpj:string;
    saldo: number;
    dadosBancario:{
        bancoNome: string;
        agencia: number;
        conta: number,
        digitoConta: number
    }[]
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
        <main className="company-profile">
            <Sidebar />
            <div className="company-container">
                <h2>Informações da Conta</h2>
                <details open={true}>
                    <summary>Detalhes da sua Conta</summary>
                        <p>Nome do Banco: {companyInfo[0].nomeEmpresa}</p>
                        <p>Agencia: {companyInfo[0].dadosBancario.agencia}</p>
                        <p>Conta: {companyInfo[0].dadosBancario.conta}</p>
                        <p>Digito Conta: {companyInfo[0].dadosBancario.digitoConta}</p>
                </details>
            </div>
        </main>
    )

}

export default CompanyProfile;