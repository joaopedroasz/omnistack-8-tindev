import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) { // Esse parâmetro "match" é usado para pegar todos os parâmetros que foram passados por URL do nosso componente.
    const [users, setUsers] = useState([]); // Essas variáveis vão ser iniciadas com um vetor vazio pq são vários devs que serão pegos na busca a API.
    const [matchDev, setMatchDev] = useState(null); // Armazenando as informações de match, se deu match ou não.

    useEffect(() => { // Essa função vai pegar os dados da API quando o componente foi exibido na tela. | Essa função recebe dois parâmetros, 1º -> Qual função vai ser executada e 2º -> Quando a função vai ser executada. Nesse caso, a função que vai ser executada, vai ser a chamada para a API, e essa função vai ser chamada sempre que o ID na url mudar.
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => { // Função vai ser chamada sempre que o ID do usuário logado musar.
        const socket = io('http://localhost:3333', {  // Conectando a variável "socket" com a API.
            // Parametros adicionais que podem ser adicionados na conecxão.
            query: {
                user: match.params.id,
            }
        });

        // Ouvindo menssagens enviadas do backend:
        socket.on('match', dev => {
            setMatchDev(dev);
            console.log(dev);
        });

    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: {
                user: match.params.id
            },
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {
                user: match.params.id
            },
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to='/'> {/* Quando o usuário clicar na imagem, vai ser levado até URL '/' */}
                <img src={logo} alt="Tindev" />
            </Link>
            <div className="listagem-dev">
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                <img src={user.avatar} alt={user.name} />
                                <footer>
                                    <strong>{user.name}</strong>
                                    <p>{user.bio}</p>
                                </footer>

                                <div className="buttons" onClick={() => handleLike(user._id)}>
                                    <button type="button">
                                        <img src={like} alt="Like" />
                                    </button>

                                    <button type="button" onClick={() => handleDislike(user._id)}>
                                        <img src={dislike} alt="Dislike" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                        <div className="empty">Acabou :(</div>
                    )}

                {/* Caso tenha algo dentro da variável "matchDev": */}
                {matchDev && (
                    <div className="match-container">
                        <img src={itsamatch} alt="It's a match!" />
                        {/* Perfil do usuário: */}
                        <img src={matchDev.avatar} alt="User avatar" className="avatar" />

                        <p className="username">{matchDev.name}</p>
                        <p className="bio">{matchDev.bio}</p>

                        <button type="button" onClick={() => setMatchDev(null)}>Fechar</button> {/* Quando esse botão é clicado, a função "setMatchDev" é chamada, passando o parâmetro false. Fazendo com que a variável "matchDev" fique com o valor false */}
                    </div>
                )}
            </div>
        </div>
    );
}
