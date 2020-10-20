import React, { useEffect, useState } from 'react';
import './CompanyProfile.css';
import api from '../../services/api';
import {useParams} from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import {Chart} from 'react-charts';

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

interface DataChart {
    primary: Date;
    secondary: number;
}

function CompanyProfile(){
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()
    const [companyTransactions, setCompanyTransactions] = useState<CompanyTransactions[]>([]);
    const [dataEntry,setDataEntry] =useState<DataChart[]>([{primary: new Date(), secondary: 0}]);
    const [dataExit,setDataExit] =useState<DataChart[]>([{primary: new Date(), secondary: 0}]);

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data))

        api.get(`transacoes/${id}`)
        .then(res => setCompanyTransactions(res.data))

        
    },[id])

    useEffect(()=>{

        let dataEntryLine :DataChart[] = companyTransactions
                    .filter(transaction => (transaction.tipoTransacao !== "CARD" && transaction.tipoTransacao !== "PAY"))
                    .map(transaction =>{
                        return{
                        primary: new Date(transaction.dataTransacao)
                        ,secondary: transaction.valor}
                        })

    let dataExitLine :DataChart[] = companyTransactions
    .filter(transaction => (transaction.tipoTransacao !== "TED_IN" && transaction.tipoTransacao !== "SLIP_IN"))
    .map(transaction =>{
        return{
        primary: new Date(transaction.dataTransacao)
        ,secondary: transaction.valor}
        })

            setDataEntry(dataEntryLine)
            setDataExit(dataExitLine)
    },[companyTransactions])

          const series = React.useMemo(
            () => ({
              showPoints: false
            }),
            []
          );
        
          const axes = React.useMemo(
            () => [
              {
                primary: true,
                type: "time",
                position: "bottom",
                showGrid: false
                // filterTicks: (ticks) =>
                //   ticks.filter((date) => +timeDay.floor(date) === +date),
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


          const info = [
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

    if(!companyInfo) return <p>Empresa não encontrada error 404</p>

    return(
        <main className="company-profile">
            <Sidebar nomeEmpresa={companyInfo[0].nomeEmpresa} saldo={companyInfo[0].saldo}/>
            <div className="company-container">
                <h2>Informações da Conta</h2>
                <details open={true}>
                    <summary>Detalhes da sua Conta</summary>
                        <p>Nome do Banco: {companyInfo[0].nomeEmpresa}</p>
                        <p>Agencia: {companyInfo[0].dadosBancario.agencia}</p>
                        <p>Conta: {companyInfo[0].dadosBancario.conta}</p>
                        <p>Digito Conta: {companyInfo[0].dadosBancario.digitoConta}</p>
                </details>  
                <div className="chart">
                <Chart  data={info} series={series} axes={axes} tooltip/>
                </div>
            </div>
        </main>
    )

}

export default CompanyProfile;