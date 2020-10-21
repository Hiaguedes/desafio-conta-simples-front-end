import React, { useEffect, useState } from 'react';
import './Cards.css';
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

interface CompanyTransactions {
    dataTransacao: string;
    valor: number;
    finalCartao: number;
    tipoTransacao: string;
    descricaoTransacao: string;
    credito: boolean;
}

export default function Cards() {
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))

    },[id])
    if(!companyInfo) return <p>Empresa não encontrada error 404</p>

    return (
        <div className="cards-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="cards-container">

            </div>
        </div>
    )
}