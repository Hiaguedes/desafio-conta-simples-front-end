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
    const [errorInput,setErrorInput] = useState(false);

    function handleFormData(){
        for(let i =0; i<object.length;i++){
            if(object[i].cnpj === inputText.replace(/\D/g,'')) {
              history.push(`/empresa/${i+1}`)
            }
        }
        setErrorInput(true);
    }

    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === 'Enter') e.preventDefault()
    }

    return (
        <main className="login_container">
            <form  className="login_form">
                <h2 className="login_title">Login</h2>
                <div className="login-input_container">
                    <label><p className="login_acessibility_label">CNPJ:</p>
                        <input 
                            onChange={e => setInputText(e.target.value)}
                             className={`login_input  ${(errorInput ? "login_input--erro" : "")}`}  
                             type="text" 
                             placeholder="Coloque o CNPJ"
                             onKeyDown={e => handleEnterKey(e)}
                             />
                    </label>
                    {
                    errorInput ? 
                    (<div className="erro_message">Alguma Coisa Está Errada</div>): 
                    (<></>)
                    }
                </div>
                <button onClick={handleFormData} className="login_button" type="button">Entrar na conta</button>
            </form>
        </main>
    )
}

export default LoginPage;