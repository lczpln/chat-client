import React, { useState, useEffect } from 'react';

import Chat from './pages/Chat';

export default function App() {
    const [nickname, setNickname] = useState('')
    const [inputValue, setInputValue] = useState('');

    if (nickname) {
        return (
            <Chat nickname={nickname} />
        );
    } else {
        return (
            <form className="login-box" onSubmit={(e) => {e.preventDefault(); setNickname(inputValue)}}>
                <h3 className="login-tittle">Digite seu nome de usuário</h3>
                <input type="text" onChange={(e) => setInputValue(e.target.value)} className="login-input" />
                <button disabled={!inputValue} className="login-button">ENTRAR</button>
            </form>
        );
    }
}