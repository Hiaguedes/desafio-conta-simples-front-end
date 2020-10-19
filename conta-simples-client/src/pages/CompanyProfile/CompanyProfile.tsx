import React, { useEffect, useState } from 'react';
import './CompanyProfile.css';
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
}

function CompanyProfile(){
    const params = useParams<Params>();
    const {id} = params;
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>()

    useEffect(()=>{
        api.get(`empresas/${id}`)
        .then(res => setCompanyInfo(res.data)
        )},[id])

    if(!companyInfo) return <p>Empresa não encontrada error 404</p>
    return(
        <div className="company-profile">
            <Sidebar />
            <div className="company-container">
                <p>ooo</p>
            </div>
        </div>
    )

}

export default CompanyProfile;