import React, {useEffect, useState} from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './ExtratoPage.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import '../../components/Table/Table.css';

interface CompanyInfo { //interface do typescript para as informações da empresa
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

interface CompanyTransactions { //interface para as transações da empresa
    dataTransacao: string;
    valor: number;
    finalCartao: number;
    tipoTransacao: string;
    descricaoTransacao: string;
    estabelecimento: string;
    credito: boolean;
}

interface Params { // interface para os parametros da requisição
    id: string;
}

export default function ExtratoPage() {


    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();// hook das informações da empresa
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);//hook das transações da empresa
    const [buttonClicked,setButtonClicked] = useState(-1);//guardo informação se teve botão clicado (a intenção é guardar o numero desse botão pelo seu index)
    const [selectTransactionFilter,setSelectTransactionFilter] = useState('any');//hook que guarda a informação se é crédito ou débito 
    const [selectPaymentFilter,setSelectPaymentFilter] = useState('any');//hook que guarda a informação contida no select do tipo de pagamento
    const [kindsOfPayment,setKindsOfPayment] = useState<string[]>([]);//hook que guarda um array de strings que são as formas de pagamento que vem pelo json

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))//guardo as informacões da empresa

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))//guardo as transações da empresa

        
    },[id])


        companyTransactions.forEach(ele => {
            if(!kindsOfPayment.includes(ele.tipoTransacao)) return setKindsOfPayment([...kindsOfPayment,ele.tipoTransacao])//para cada transacao que a empresa fez verifico se o tipo de transacao existe no array kindsOfPayment
                                                                                                                            // se não guarda a informação
        })

    function handleClickedButton(index:number) {
        setButtonClicked(index);//guarda a index do botão de transação do extrato

    }

    function handleTransactionType(e: React.ChangeEvent<HTMLSelectElement>){
        setSelectTransactionFilter(e.target.value);//guarda o pagamaento selecionado no filtro Tipo da Transação:
    }

    function handlePaymentFilter(e: React.ChangeEvent<HTMLSelectElement>){
        setSelectPaymentFilter(e.target.value);//guarda o valor selecionado no filtro Crédito ou Débito?
    }
    

    if(!companyInfo) return <p>Carregando a página :)</p> // se não encontrou as informações da empresa mostra mensagem
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
                        {kindsOfPayment.map((ele,index)=>{ //faz a caixa de seleção do filtro da transação
                        return(<option key={index} value={ele}>{ele.replace('_',' ')}</option>); 
                        })
                    }
                    </select>
                    </div>
                    <div className="filtro_individual">
                        <p>Crédito ou Débito?</p>
                    <select onChange={(e) => handlePaymentFilter(e)}>
                        <option value="any">Qualquer</option>
                        <option value="true">Crédito</option> {/*Desculpa a ignorância mas não sei mesmo o que seria TED IN ou SLIP IN hahaha (muito menos o SLIP e como não achei nada na internet então sorry, tenho muito o que aprender ainda :D)*/}
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
                        {companyTransactions//aqui é interessante porém trabalhoso então vai lá
                            .filter(transaction =>{//primeiramente filtro os dados das transações de cada empresa
                                if(selectTransactionFilter !== 'any')//se ela for diferente de any que é o dado inicial para qualquer
                                    return transaction.tipoTransacao === `${selectTransactionFilter}`//retorno apenas os objetos cujos tipos de transações sejam iguais aos que estão selecionados no filtro Tipo da Transação

                                return transaction.tipoTransacao !== null// se for any o valor selecionado retorne o array da forma como ele esta mesmo
                            })
                            .filter(transaction => {
                                if(selectPaymentFilter !== 'any')//aí passo para o proximo filtro que pega o valor que está na caixa Crédito ou Débito?
                                return String(transaction.credito) === selectPaymentFilter // retorna apenas os valores das transações que tem o mesmo valor selecionado na caixa Crédito ou Débito?
                                    // aqui transformo em string o crédito pois o que vem como valor de um select é um tipo string enquanto o credito está no tipo number

                                return transaction.credito !== null // se for any o valor selecionado retorne o array da forma como ele esta mesmo
                            })
                            .map((transaction,index) =>{
                            //a string vem como 2020-09-01T10:50:00 (que é uma saída do tipo Date) se eu separo pelo T eu tenho ["2020-09-01","10:50:00"]
                            const arrayDataHorario = transaction.dataTransacao.split('T'); // divido a string em dois arrays, a primeira contem o dia a segunda o horário
                            const arrayDia = arrayDataHorario[0].split('-');//dou uma arrumada na visualização da data separando por - o que deixa outro array como ["2020","09","01"] com os valores sendo ano,mês e dia
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
                                            (buttonClicked>-1 && index === buttonClicked)? /* Aqui também é legal eu verifico se o botão clicado não é o valor inicial e tem o mesmo index que o butão clicado */
                                            (<td className="table_body-details"> {/* pois pegaremos a linha desse index para criar um novo td (que ficará separado da tabela ) para mostrar os detalhes do extrato */}
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