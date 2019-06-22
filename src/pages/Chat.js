import React, { useState, useEffect } from 'react';
import socket from 'socket.io-client';

import api from '../services/api';

import Loading from '../components/loading';

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, [])

  async function loadMessages() {
    try {
      const response = await api.get('/');

      setMessages(response.data)
      setLoading(false);
    } catch (e) {
      alert(`Falha de conexão => ${e}`)
    }
  }

  async function loadRealTime() {
    const io = socket('https://chat-api-fast-chat.herokuapp.com/'); /* https://chat-api-fast-chat.herokuapp.com/ */

    io.on('newMessage', data => {
      setMessages(data)
    })

    io.on('reqWelcome', async data => {
      await api.post(`/welcome/${props.nickname}`, { "date": Date() })
    })

    io.on('reqGoodbye', async data => {
      await api.post(`/welcome/${props.nickname}`, { "date": Date() })
    })
  }

  async function userSendMessage(e) {
    if (!requestData.message || !requestData.nickname) return false

    e.preventDefault();

    const data = { "msg": requestData.message, "date": Date() }

    try {
      const response = await api.post(`/message/${requestData.nickname}`, data)

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
        {loading && <Loading />}
        {messages.map((message, _) => (
          message.nickname === "MASTER123456789ROBOT" ? (
            <div className="message-box-system">
              <span className="message-text">{message.msg}</span>
              <div className="message-info">
                <span className="message-date">{message.date ? message.date.split(" ")[4] : ''}</span>
              </div>
            </div>
          ) : (
              <div key={_} className={message.nickname === userNickname ? "message-box-author animated fadeInLeft" : "message-box-other animated fadeInRight"}>
                <span className="message-text">{message.msg}</span>
                <div className="message-info">
                  <span className="message-author">{message.nickname}</span>
                  <span className="message-date">{message.date.split(" ")[4]}</span>
                </div>
              </div>
            )
        ))}
      </div>
      <form className="user-controllers" onSubmit={(e) => userSendMessage(e)}>
        <input
          autoFocus={true}
          autoComplete="off"
          className="message-text"
          placeholder="Type your new message here."
          id="messageText"
          value={requestData.message}
          type="text"
          maxLength="60"
          onChange={(e) => setRequestData({ ...requestData, message: e.target.value.slice(0, 1).toUpperCase() + e.target.value.slice(1, e.target.value.length) })}
        />
        <button className="send-message" disabled={!requestData.message || !requestData.nickname}>SEND</button>
      </form>
      <div className="button-div">
      </div>
    </div>
  );
}

export default Chat;
