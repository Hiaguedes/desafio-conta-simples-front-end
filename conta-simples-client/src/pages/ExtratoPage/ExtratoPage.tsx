import React, {useEffect, useState} from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './ExtratoPage.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';

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

interface Params {
    id: string;
}

export default function ExtratoPage() {


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

    if(!companyInfo) return <p>Empresa não encontrada erro 404</p>

    return(
        <main className="extract-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="extract-page_container">
                <h2 className="extract-page_title">Extrato da empresa</h2>

            </div>
        </main>
    )
}