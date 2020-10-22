import React, { useEffect, useState } from 'react';
import './Cards.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../components/Table/Table.css';

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
                <h2>Uso dos seus cartões</h2>
                {
                    cards.map((card,index)=>{
                        const total = companyTransactions
                                            .filter(transaction => transaction.finalCartao === card)
                                            .reduce((acc,next) => acc + next.valor,0);

                        if(card !== null)
                        return(
                            <div key={index}>
                                <h2>Transações feitas com o cartão com final: <strong>{card}</strong></h2>
                                <details className="table_container">
                                    <summary>Transações Feitas com o cartão</summary>
                                    <table className="table">
                                        <thead className="table_header">
                                            <tr>
                                                <th className="table_header-data">Data Transação</th>
                                                <th className="table_header-data">Horário</th>
                                                <th className="table_header-data">Para onde</th>
                                                <th className="table_header-data">Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                    {

                                        companyTransactions.map((transaction,index) =>{
                                            const arrayDataHorario = transaction.dataTransacao.replace('T',' ').split(' '); // divido a string em dois arrays, a primeira contem o dia a segunda o horário
                                            const arrayDia = arrayDataHorario[0].split('-');
                                            if(transaction.finalCartao === card){
                                                return(
                                                <tr key={index} className="table_body-line">
                                                    <td className="table_body-data">{`${arrayDia[2]}/${arrayDia[1]}/${arrayDia[0]}`}</td>
                                                    <td className="table_body-data">{arrayDataHorario[1]}</td>
                                                    <td className="table_body-data">{transaction.estabelecimento}</td>
                                                    <td className="table_body-data">R$ {transaction.valor.toFixed(2)}</td>
                                                </tr>)
                                            }
                                        })
                                    }
                                    <tr className="table_body-line">
                                        <td className="table_body-data">Total: </td>
                                        <td className="table_body-data"></td>
                                        <td className="table_body-data"></td>
                                        <td className="table_body-data">R$ {total.toFixed(2)}</td>
                                    </tr>
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