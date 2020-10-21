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
        digitoConta: number;
    }[]
}

interface CompanyTransactions {
    dataTransacao: string;
    valor: number;
    finalCartao: number;
    tipoTransacao: string;
    descricaoTransacao: string;
    estabelecimento: string;
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
    const [buttonClicked,setButtonClicked] = useState(-1);

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))

        
    },[id])

    function handleClickedButton(index:number) {
        setButtonClicked(index);

    }

    if(!companyInfo) return <p>Empresa não encontrada erro 404</p>

    return(
        <main className="extract-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="extract-page_container">
                <h2 className="extract-page_title">Extrato da empresa</h2>
                <div className="table_container">
                <table className="table">
                    <thead className="table_header">
                        <tr>
                        <th className="table_header-data">Data</th>
                        {/* <th className="table_header-data">Horário</th> */}
                        <th className="table_header-data">Descricao</th>
                        {/* <th className="table_header-data">Estabelecimento</th> */}
                        <th className="table_header-data">Valor</th>
                        <th className="table_header-data">Detalhes da Transação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companyTransactions.map((transaction,index) =>{
                            const arrayDataHorario = transaction.dataTransacao.replace('T',' ').split(' '); // divido a string em dois arrays, a primeira contem o dia a segunda o horário
                            const arrayDia = arrayDataHorario[0].split('-');
                            return(
                                
                                    <tr key={index} className={`table_body-line ${(transaction.tipoTransacao === 'SLIP_IN' ||transaction.tipoTransacao === 'TED_IN')? 'entry' : 'exit'}`}>
                                        <td className="table_body-data">{`${arrayDia[2]}/${arrayDia[1]}/${arrayDia[0]}`}</td>
                                        {/* <td className="table_body-data">{arrayDataHorario[1]}</td> */}
                                        <td className="table_body-data">{transaction.descricaoTransacao}</td>
                                        {/* <td className="table_body-data">{transaction.estabelecimento}</td> */}
                                        <td className="table_body-data">{`R$ ${transaction.valor.toFixed(2)}`}</td>
                                        <td className="table_body-button">
                                            <button className="table_button" onClick={() => handleClickedButton(index)}>
                                                Ver Detalhes
                                            </button>
                                        </td>
                                        {
                                            (buttonClicked>-1 && index === buttonClicked)?
                                            (<td className="table_body-details">
                                                <p>Horário da Transação: {arrayDataHorario[1]}</p>
                                               {transaction.estabelecimento && <p>Nome do Estabelecimento Beneficiado: {transaction.estabelecimento}</p>}
                                               {transaction.finalCartao && <p>Número final do Cartão: {transaction.finalCartao}</p>}
                                               <p>Tipo da Transação: {transaction.tipoTransacao}</p>
                                                
                                                </td>)
                                            :
                                            (<></>)
                                        }
                                    </tr>
                                
                            )
                        })}
                </tbody>
                </table>
                </div>
            </div>
        </main>
    )
}