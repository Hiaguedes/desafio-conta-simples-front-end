import React, {useEffect, useState} from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './ExtratoPage.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import '../../components/Table/Table.css';

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
    const [selectTransactionFilter,setSelectTransactionFilter] = useState('any');
    const [selectPaymentFilter,setSelectPaymentFilter] = useState('any');
    const [kindsOfPayment,setKindsOfPayment] = useState<string[]>([]);

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))

        
    },[id])


        companyTransactions.forEach(ele => {
            if(!kindsOfPayment.includes(ele.tipoTransacao)) return setKindsOfPayment([...kindsOfPayment,ele.tipoTransacao])
        })

    function handleClickedButton(index:number) {
        setButtonClicked(index);

    }

    function handleTransactionType(e: React.ChangeEvent<HTMLSelectElement>){
        setSelectTransactionFilter(e.target.value);
    }

    function handlePaymentFilter(e: React.ChangeEvent<HTMLSelectElement>){
        setSelectPaymentFilter(e.target.value);
    }
    

    if(!companyInfo) return <p>Carregando a página :)</p>
    //console.log(selectTransactionFilter,selectPaymentFilter)
    return(
        <main className="extract-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="extract-page_container">
                <h2 className="extract-page_title">Extrato da empresa</h2>
                {companyTransactions.length ===0? 
                (<p className="extract_no-transactions">Você não fez nenhuma transação conosco.
                Sinta-se a vontade para fazer quando você bem entender ;D</p>):
                <>
                <div className="filtros_container">
                    <h3 className="filtros_titulo">Filtros para a Tabela</h3>
                    <div className="filtro">

                    <div className="filtro_individual">
                    <p>Tipo da Transação: </p>
                    <select onChange={(e) => handleTransactionType(e)}>
                        <option value="any">Qualquer</option>
                        {kindsOfPayment.map((ele,index)=>{
                        return(<option key={index} value={ele}>{ele.replace('_',' ')}</option>); 
                        })
                    }
                    </select>
                    </div>
                    <div className="filtro_individual">
                        <p>Crédito ou Débito?</p>
                    <select onChange={(e) => handlePaymentFilter(e)}>
                        <option value="any">Qualquer</option>
                        <option value="true">Crédito</option> {/*Desculpa a ignorância mas não sei mesmo o que seria TED IN ou SLIP IN hahaha (muito menos o SLIP e como não achei nada na internet então sorry*/}
                        <option value="false">Débito</option>
                    </select>
                    </div>
                    </div>
                </div>
                
                
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
                        {companyTransactions
                            .filter(transaction =>{
                                if(selectTransactionFilter !== 'any')
                                    return transaction.tipoTransacao === `${selectTransactionFilter}`

                                return transaction.tipoTransacao !== null
                            })
                            .filter(transaction => {
                                if(selectPaymentFilter !== 'any')
                                return String(transaction.credito) === selectPaymentFilter

                                return transaction.credito !== null
                            })
                            .map((transaction,index) =>{
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
                                               {transaction.credito? 
                                               <p>Pagamento feito no crédito</p>
                                                : <p>Pagamento feito no débito</p>
                                            }
                                                
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
                </>
            }
            </div>
        </main>
    )
}