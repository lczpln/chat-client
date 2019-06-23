import React, { useState, useEffect } from 'react';

import Chat from './pages/Chat';
import api from './services/api';

export default function App() {
    const [nickname, setNickname] = useState('')
    const [inputValue, setInputValue] = useState('');
    const [globalNicknames, setGlobalNicknames] = useState('');

    useEffect(() => {
        getNicknames()
    }, [])

    async function getNicknames() {
        try {
            const response = await api.get('/');

            if (!response) return alert("Erro ao conectar-se com a API");
            const data = [...response.data.map(user => user.nickname)]

            const filteredData = [...new Set(data)];

            setGlobalNicknames(filteredData)
        } catch (error) {
            return alert("Erro ao conectar-se com a API => " + error);
        }
    }

    function checkNickname(e) {
        e.preventDefault();

        if (globalNicknames.includes(inputValue)) return alert("Alguem usou esse nickname a pouco tempo atrás")

        setNickname(inputValue);
    }

    if (nickname) {
        return (
            <Chat nickname={nickname} />
        );
    } else {
        return (
            <div className="background fadeIn animated">
                <form className="login-box fadeInDown animated" onSubmit={(e) => checkNickname(e)}>
                    <h3 className="login-tittle">Digite seu nome</h3>
                    <input type="text" placeholder={`Crie um nick para usar no chat.`} onChange={(e) => setInputValue(e.target.value)} className="login-input" />
                    <button disabled={!inputValue} className="login-button">ENTRAR</button>
                </form >
            </div>
        );
    }
}