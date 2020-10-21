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
    estabelecimento: string;
}

export default function Cards() {
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);
    const [cards,setCards] = useState<number[]>([]);

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))

    },[id])

    companyTransactions.forEach(ele => {
        if(!cards.includes(ele.finalCartao)) return setCards([...cards,ele.finalCartao])
    })

    if(!companyInfo) return <p>Empresa não encontrada error 404</p>

    return (
        <div className="cards-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="cards-container">
                {
                    cards.map((card,index)=>{
                        if(card !== null)
                        return(
                            <div key={index}>
                                <h2>Transações feitas com o cartão com final: <strong>{card}</strong></h2>
                                <details>
                                    <summary>Transações Feitas com o cartão</summary>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Data Transação</th>
                                                <th>Horário</th>
                                                <th>Valor</th>
                                                <th>Para onde</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                    {
                                        companyTransactions.map((transaction,index) =>{
                                            const arrayDataHorario = transaction.dataTransacao.replace('T',' ').split(' '); // divido a string em dois arrays, a primeira contem o dia a segunda o horário
                                            const arrayDia = arrayDataHorario[0].split('-');
                                            if(transaction.finalCartao === card){
                                                return(
                                                <tr key={index}>
                                                    <td>{`${arrayDia[2]}/${arrayDia[1]}/${arrayDia[0]}`}</td>
                                                    <td>{arrayDataHorario[1]}</td>
                                                    <td>{transaction.valor}</td>
                                                    <td>{transaction.estabelecimento}</td>
                                                </tr>)
                                            }
                                        })
                                    }
                                    </tbody>
                                    </table>
                                </details>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}