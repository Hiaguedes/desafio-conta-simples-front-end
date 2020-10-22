import React, { useEffect, useState } from 'react';
import './CompanyProfile.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import {Chart} from 'react-charts';//infelizmente não tem os types dessa biblioteca, essa biblioteca foi a mais simples que encontrei mas infelizmente não tem tanta opção assim

interface Params {//interface para os parâmetros da requisição
    id: string;
}

interface CompanyInfo {// interface para os dados da empresa
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

interface CompanyTransactions {// interface para as transações
    dataTransacao: string;
    valor: number;
    finalCartao: number;
    tipoTransacao: string;
    descricaoTransacao: string;
    credito: boolean;
}

interface DataChart {// interface para as informações que preciso para a tabela
    primary: Date;
    secondary: number;
}

function CompanyProfile(){
    const params = useParams<Params>();
    const {id} = params;// guardo a id que é levada pela uri
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(); //hook para guardar as informações da empresa
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);// hook para guardar as transações que a empresa fez
    const [dataEntry,setDataEntry] =useState<DataChart[]>([{primary: new Date(), secondary: 0}]);// hook para guardar as transações de entrada da empresa, pro gráfico
    const [dataExit,setDataExit] =useState<DataChart[]>([{primary: new Date(), secondary: 0}]);// hook para guardar as transações de saída da empresa, pro gráfico

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))// guardar as informações da empresa

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))// guardar as transações da empresa

        
    },[id])

    useEffect(()=>{

        let dataEntryLine :DataChart[] = companyTransactions // aqui monto o objeto com os dados das transações de saída
                    .filter(transaction => (transaction.tipoTransacao !== "CARD" && transaction.tipoTransacao !== "PAY"))// filtrando pelos tipos de transação que são de saída (pode ter uma forma melhor que essa só não percebi como mesmo)
                    .map(transaction =>{
                        return{
                        primary: new Date(transaction.dataTransacao) //só preciso do dia da transação
                        ,secondary: transaction.valor} // e do dado que no caso é o valor
                        })

    let dataExitLine :DataChart[] = companyTransactions // aqui faço o objeto com os dados das transações de entrada
    .filter(transaction => (transaction.tipoTransacao !== "TED_IN" && transaction.tipoTransacao !== "SLIP_IN"))
    .map(transaction =>{
        return{
        primary: new Date(transaction.dataTransacao)
        ,secondary: transaction.valor}
        })

            setDataEntry(dataEntryLine)
            setDataExit(dataExitLine)
    },[companyTransactions])

          const series = React.useMemo( //da biblioteca react-chart, eu podia componetizar essa tabela mas como ela só é usada aqui então o simples foi deixar ela aqui mesmo
            () => ({
              showPoints: false
            }),
            []
          );
        
          const axes = React.useMemo(// informações dos eixos do gráfico
            () => [
              {
                primary: true,
                type: "time",
                position: "bottom",
                showGrid: false

                //eixo x
              },
              { 
                  type: "linear",
                  position: "left",
                  show:false,
                  hardMax:7000 
                  //eixo y
                }
            ],
            []
          );


          const info = [// aqui é onde monto o array de objetos que é interpretado pelo gráfico
            {
              // individual series
              label: "Entrada",
              // datum array
              data: dataEntry
            },
            {
                // individual series
                label: "Saída",
                // datum array
                data: dataExit
              }
        ]


        if(!companyInfo) return <p>Carregando a página :)</p>// enquanto os dados da empresão não carregados mostra essa mensagem (seria legal um shimmer effect)

    return(
        <main className="company-profile">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="company-container">
                <h2 className="company_title">Informações da Conta</h2>
                <details className="company_details" open={true}>
                    <summary className="company_summary">Detalhes da sua Conta</summary>
                        <p>Nome do Empresa: <strong className="company_details_strong">{companyInfo[0].nomeEmpresa}</strong></p>
                        <p>Banco: <strong className="company_details_strong">{companyInfo[0].dadosBancario.bancoNome}</strong></p>
                        <p>Agencia: <strong className="company_details_strong">{companyInfo[0].dadosBancario.agencia}</strong></p>
                        <p>Conta: <strong className="company_details_strong">{companyInfo[0].dadosBancario.conta}</strong></p>
                        <p>Digito: <strong className="company_details_strong">{companyInfo[0].dadosBancario.digitoConta}</strong></p>
                </details>
                {  companyTransactions.length ===0 ? 
                (<p className="company_no-transactions">Você não fez nenhuma transação conosco.
                     Sinta-se a vontade para fazer quando você bem entender ;D</p>):
                (<div className="chart">
                <Chart  data={info} series={series} axes={axes} tooltip/>
                </div>)
                }
            </div>
        </main>
    )

}

export default CompanyProfile;