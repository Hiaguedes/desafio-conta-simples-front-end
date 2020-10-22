import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import api from '../../services/api';
import {useHistory} from 'react-router-dom';

function LoginPage() {

    interface ObjectLogin {//interface do objeto de login da página
        id: number;
        cnpj:string;
    }
    const history = useHistory();
    const [object, setObject] = useState<ObjectLogin[]>([]);
    const [inputText,setInputText] = useState<String>('');
    const [errorInput,setErrorInput] = useState(false);

    useEffect(() => {
        api.get('empresas')
        .then(res=> setObject(res.data));// puxo o dado de todas as empresas e seto ela no array com todas as empresas
    },[])


    function handleFormData(){
        for(let i =0; i<object.length;i++){  //para todos os objetos verifico se tenho um cnpj digitado no campo (independente se tempo pontos, vírgulas ate mesmo letras)
            if(object[i].cnpj === inputText.replace(/\D/g,'')) {
              history.push(`/empresa/${i+1}`)//se sim jogo a pagina para a url propria para a empresa
              //deve ter formas mais eficazes de se fazer essa verificação (até por que não vão ter só 3 empresas cadastradas no sistema, mas nesse caso o back end pode ajudar a gente também com o query),
              // mas para não complicar demais optei pelo método mais simples que é um simples for mesmo
            }
        }
        setErrorInput(true);// se não há o cnpj digitado no campo eu jogo uma mensagem de erro de alto nível
    }

    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key === 'Enter') e.preventDefault() // aqui eu evito que quando eu apertar enter dentro do input a página recarregue
    }

    return (
        <main className="login_container">
            <form  className="login_form">
                <h2 className="login_title">Login</h2>
                <div className="login-input_container">
                    <label><p className="login_acessibility_label">CNPJ:</p>
                        <input 
                            onChange={e => setInputText(e.target.value)}
                             className={`login_input  ${(errorInput ? "login_input--erro" : "")}`}  //Aqui mudo a estilização do input caso ocorra um erro
                             type="text" 
                             placeholder="Coloque o CNPJ"
                             onKeyDown={e => handleEnterKey(e)}
                             />
                    </label>
                    {
                    errorInput && 
                    (<div className="erro_message">CNPJ não encontrada</div>) //aqui imprimo na tela a mensagem de erro caso tenha algum erro
                    }
                </div>
                <button onClick={handleFormData} className="login_button" type="button">Entrar na conta</button>
            </form>
        </main>
    )
}

export default LoginPage;