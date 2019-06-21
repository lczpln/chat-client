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
    var realHeight = document.querySelector("#chatBox").scrollHeight;
    document.querySelector("#chatBox").scrollTo(0, realHeight)
  }, [messages])

  useEffect(() => {
    if (props.nickname) {
      setUserNickname(props.nickname)
      setRequestData({ ...requestData, nickname: props.nickname })
    } else {
      return window.location.href = '/';
    }

    loadMessages()
    loadRealTime()

    const chatBox = document.querySelector("#chatBox");
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [])

  async function loadMessages() {
    try {
      const response = await api.get('/');

      setMessages(response.data)
    } catch (e) {
      alert(`Falha de conexão => ${e}`)
    }
  }

  async function loadRealTime() {
    const io = socket('https://chat-api-fast-chat.herokuapp.com/');

    io.on('newMessage', data => {
      setMessages(data)
    })
  }

  async function userSendMessage(e) {
    if (!requestData.message || !requestData.nickname) return false

    e.preventDefault();

    try {
      const response = await api.post(`/message/${requestData.nickname}/${requestData.message}`)

      if (response) {
        setRequestData({ ...requestData, message: '' })
      }
    } catch (error) {
      alert(`Não foi possível enviar sua mensagem => ${error}`)
    }
  }

  return (
    <div className="App">
      <div className="chat-box" id="chatBox">
        {messages.map((message, _) => (
          <div key={_} className={message.nickname === userNickname ? "message-box-author animated fadeInLeft" : "message-box-other animated fadeInRight"}>
            <span className="message-text">{message.msg}</span>
            <div className="message-info">
              <span className="message-author">{message.nickname}</span>
              <span className="message-date">{message.date.split(" ")[4]}</span>
            </div>
          </div>
        ))}
      </div>
      <form className="user-controllers" onSubmit={(e) => userSendMessage(e)}>
        <input className="message-text" placeholder="Type your new message here." id="messageText" value={requestData.message} type="text" maxLength="60" onChange={(e) => setRequestData({ ...requestData, message: e.target.value })} />
        <button className="send-message" disabled={!requestData.message || !requestData.nickname}>SEND</button>
      </form>
      <div className="button-div">
      </div>
    </div>
  );
}

export default Chat;
