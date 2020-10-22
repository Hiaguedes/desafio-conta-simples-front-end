import React, { useEffect, useState } from 'react';
import './Cards.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../components/Table/Table.css';

interface Params {//interface para os parametros da requisição, somente pegando a id
    id: string;
}

interface CompanyInfo {//interface das informacoes da empresa
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

interface CompanyTransactions {//interface das transacoes da empresa
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
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();//state que guarda todas as informacoes da empresa
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);// state que salva todas as transações da empresa
    const [cards,setCards] = useState<number[]>([]);//state que armazena os numeros dos cartoes usados pela empresa

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data)) //requisitando dados da api para guardar dados da empresa

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data)) //requisitando dados da api para guardar transacoes feitas pela empresa

    },[id])

    companyTransactions.forEach(transaction => {
        if(!cards.includes(transaction.finalCartao)) return setCards([...cards,transaction.finalCartao]);
        //itero sobre as transacoes da empresa e verifico se para cada transação
        // eu tenho incluso no array de cartoes o cartao da transação que eu estou,
        // se não tiver adiciona no array se tiver apenas ignora
    })

    if(!companyInfo) return <p>Carregando a página :)</p> //se as informações da empresa não tiverem sido carregadas ainda mostre a mensagem (seria legal o shimmer effect aqui)

    return (
        <div className="cards-page">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="cards-container">
                <h2 className="cards_title">Uso dos seus cartões</h2>

                {companyTransactions.length ===0? //se não tem transação não tem o que mostrar então mostre uma frase e como salvamos tudo em um array então se o seu tamanho é zero então não tem nada
                (<p className="card_no-transactions">Você não fez nenhuma transação conosco.
                Sinta-se a vontade para fazer quando você bem entender ;D</p>):
                <>
                {
                    cards.map((card,indexCards)=>{// itero para cada cartão do cliente
                        const total = companyTransactions
                                            .filter(transaction => transaction.finalCartao === card)
                                            .reduce((acc,next) => acc + next.valor,0); //calculo o total gasto por cada cartao

                        if(card !== null)// em algumas transações (como o de receber) o card é null então tenho que colocar essa exceção
                        //ai monta uma tabela com as transações de cada cartao
                        return(
                            <div key={indexCards} className="cards_transactions_container">
                                <h2 className="cards_transactions_title">Número final do cartão: <strong className="cards_transactions_title--strong">{card}</strong></h2>
                                <details className="table_container" open={indexCards === 0 ? true: false}>
                                    <summary className="cards_transactions--summary">Transações Feitas com o cartão</summary>
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

                                        companyTransactions.filter(transaction => transaction.finalCartao === card).map((transaction,index) =>{// mapeio as transações por cartão
                                            //a string vem como 2020-09-01T10:50:00 (que é uma saída do tipo Date) se eu separo pelo T eu tenho ["2020-09-01","10:50:00"]
                                            const arrayDataHorario = transaction.dataTransacao.split('T'); // divido a string em dois arrays, a primeira contem o dia a segunda o horário
                                            const arrayDia = arrayDataHorario[0].split('-');//dou uma arrumada na visualização da data separando por - o que deixa outro array como ["2020","09","01"] com os valores sendo ano,mês e dia
                                                return(
                                                <tr key={`${indexCards}-${index}`} className="table_body-line">
                                                    <td className="table_body-data">{`${arrayDia[2]}/${arrayDia[1]}/${arrayDia[0]}`}</td>
                                                    <td className="table_body-data">{arrayDataHorario[1]}</td>
                                                    <td className="table_body-data">{transaction.estabelecimento}</td>
                                                    <td className="table_body-data">R$ {transaction.valor.toFixed(2)}</td>
                                                </tr>)
                                        })
                                    }
                                    <tr key={`total-${indexCards}`} className="table_body-line">
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
                        return(<></>);
                    })
                }
                </>
                }
            </div>
        </div>
    )
}