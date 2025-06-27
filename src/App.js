import axios from 'axios';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import ChatBox from './chatBox';

function App() {
  const [message, set_message] = useState('');
  const [chat, set_chat] = useState([]);
  const latestChatUpdate = useRef(chat);

  function call_api(message_data) {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:5000/api/chat',
      data: message_data,
      headers: {'Content-Type': 'multipart/form-data'}
    })
    .then((response) => {
      console.log(response.data.answer);
      set_chat([...latestChatUpdate.current, response.data.answer])
    })
    .catch((error) => {
      console.error("Error: " + error);
    });
  }

  const send_message = async (e) => {
    e.preventDefault();

    if (message !== '') {
      let message_data = new FormData();

      set_chat(prev => {
        const updated = [...prev, message];
        latestChatUpdate.current = updated;
        return updated;
      });

      message_data.append('message', message)

      await call_api(message_data);

      set_message('');
    }
  }

  const container_ref = useRef();

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className='App'>
      <div ref={container_ref} className='chat'>
        {chat.map((msg, index) => (
          <ChatBox key={index} value={msg}/>
        ))}
      </div>
      <form onSubmit={send_message} className='interface'>
        <input name='message-box' className='message-box' type='text' placeholder='Write something...' value={message} onChange={e => set_message(e.target.value)}></input>
        <input className='send-message-button' type='submit' value='Send'></input>
      </form>
    </div>
  );
}

export default App;
