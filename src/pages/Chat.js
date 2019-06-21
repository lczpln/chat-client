import React, { useState, useEffect } from 'react';
import socket from 'socket.io-client';

import api from '../services/api';

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [userNickname, setUserNickname] = useState('');
  const [requestData, setRequestData] = useState({
    nickname: '',
    message: '',
  })

  useEffect(() => {
    if (props.nickname) {
      setUserNickname(props.nickname)
      setRequestData({ ...requestData, nickname: props.nickname })
    } else {
      return window.location.href = '/';
    }

    loadMessages()
    loadRealTime()
  }, [])

  async function loadMessages() {
    try {
      const response = await api.get('/');

      setMessages(response.data)
      const messageText = document.getElementById("#messageText");
      messageText.value = ''

    } catch (e) {
      alert('Conexão com a API mal sucedida.')
    }
  }

  async function loadRealTime() {
    const io = socket('http://localhost:3001');

    io.on('newMessage', data => {
      setMessages(data)
    })

    const chatBox = document.querySelector("#chatBox");
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function makeRequest() {
    try {
      const response = await api.post(`/message/${requestData.nickname}/${requestData.message}`)

    } catch (error) {
      alert(`Não foi possível enviar sua mensagem => ${error}`)
    }
  }

  return (
    <div className="App">
      <div className="chat-box" id="chatBox">
        {messages.map((message, _) => (
          <div key={_} className={message.nickname === userNickname ? "message-box-author" : "message-box-other"}>
            <span className="message-text">{message.msg}</span>
            <div className="message-info">
              <span className="message-author">{message.nickname}</span>
              <span className="message-date">{message.date.split(" ")[4]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="user-controllers">
        <input className="message-text" id="messageText" type="text" maxLength="60" onChange={(e) => setRequestData({ ...requestData, message: e.target.value })} />
        <button className="send-message" disabled={!requestData.message || !requestData.nickname} onClick={() => makeRequest()}>SEND</button>
      </div>
      <div className="button-div">
      </div>
    </div>
  );
}

export default Chat;
