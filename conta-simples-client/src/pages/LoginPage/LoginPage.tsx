import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import api from '../../services/api';
import {useHistory} from 'react-router-dom';

function LoginPage() {

    interface ObjectLogin {
        id: number;
        nomeEmpresa:string;
        cnpj:string;
    }

    useEffect(() => {
        api.get('empresas')
        .then(res=> setObject(res.data));
    },[])

    const history = useHistory();
    const [object, setObject] = useState<ObjectLogin[]>([]);
    const [inputText,setInputText] = useState<String>('');

    function handleFormData(){
        for(let i =0; i<object.length;i++){
            if(object[i].cnpj === inputText.replace(/\D/g,'')) {
                console.log(i)
              history.push(`/empresa/${i+1}`)
            }
        }
        return null;
    }

    return (
        <main className="login_container">
            <form  className="login_form">
                <h2 className="login_title">Login</h2>
                <input onChange={e => setInputText(e.target.value)} className="login_input" type="text" placeholder="Coloque o CNPJ"/>
                <button onClick={handleFormData} className="login_button" type="button">Entrar na conta</button>
            </form>
        </main>
    )
}

export default LoginPage;