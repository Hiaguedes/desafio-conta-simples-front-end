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

function CompanyProfile(){
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data)
        )},[id])

        const data = [
            {
              // individual series
              label: "Entrada",
              // datum array
              data: [
                {
                  // individual datum
                  primary: new Date(2011,10,1), // primary value
                  secondary: 20 // secondary value
                },
                {
                  // individual datum
                  primary: new Date(2011,10,2), // primary value
                  secondary: 250 // secondary value
                },
                {
                  // individual datum
                  primary: new Date(2011,10,2,8), // primary value
                  secondary: 250 // secondary value
                }
              ]
            },
            {
              label: "Saída",
              data: [
                {
                  // individual datum
                  primary: new Date(2011,10,1), // primary value
                  secondary: 50 // secondary value
                },
                {
                  // individual datum
                  primary: new Date(2011,10,2), // primary value
                  secondary: 20 // secondary value
                },
                {
                  // individual datum
                  primary: new Date(2011,10,3), // primary value
                  secondary: 130 // secondary value
                }
              ]
            }
          ];
        
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
                type: "utc",
                position: "bottom"
                // filterTicks: (ticks) =>
                //   ticks.filter((date) => +timeDay.floor(date) === +date),
              },
              { type: "linear", position: "left" }
            ],
            []
          );

    if(!companyInfo) return <p>Empresa não encontrada error 404</p>
    return(
        <main className="company-profile">
            <Sidebar />
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
                    <Chart  data={data} series={series} axes={axes} tooltip/>
                </div>
            </div>
        </main>
    )

}

export default CompanyProfile;