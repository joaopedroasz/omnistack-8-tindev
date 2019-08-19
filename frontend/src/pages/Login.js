import React, { useState } from 'react'; // Sempre que for usar com componente, tem que fazer essa importação.

import api from '../services/api';
import logo from '../assets/logo.svg' // Importando imagem.

import './Login.css';

// Criando o componente Login:
// Esse esquema de HTML dentro do JS é chamado JSX.
export default function Login({ history }) {
    const [username, setUsername] = useState(''); // Essa sintaxe de vetor é usada pq o "useState()" retorna dois valores, que cada um será armazenado em cada variável. | Usar o "useState" quando tivermos variáveis que vão ser usadas em todo nosso componente.

    async function handleSubmit(e) {
        e.preventDefault(); // Essa função barra o comportamento que o formulário tem de trocar a página quando o usuário da um submit.

        const response = await api.post('/devs', {
            username, // = username: username
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <img src={logo} alt="Tindev" />

            <form onSubmit={handleSubmit}> {/* A função handleSubmit vai ser chamada quando o usuario der submit no formulário */}
                <input
                    type="text"
                    placeholder="Digite seu usuário no Github"
                    value={username}
                    onChange={e => setUsername(e.target.value)} // A função "onChange" dispara um evento quando a pripriedade em questão muda. | Nesse caso quando o input mudar, vai pegar o que o usuário digitou e mudar o username => setUsername(e.target.value) | e.target.value é o valor que o usuário digitou.
                />

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
