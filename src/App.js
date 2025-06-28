import axios from 'axios';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import ChatBox from './components/chatBox';
import NavBar from './components/NavBar';


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
      set_chat([...latestChatUpdate.current, "**Bot**: " + response.data.answer]);
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
  <div className="bg-neutral-800 min-h-screen grid grid-cols-10 gap-0 text-lg">
    <NavBar set_chat={set_chat} className='col-span-1'/>
    <div className='grid grid-rows-10 col-span-9 px-[100px]'>
      <div ref={container_ref} className='row-span-9 content-end'>
        {chat.map((msg, index) => (
          <ChatBox key={index} value={msg} />
        ))}
      </div>
      <div className='row-span-1 bottom-0 bg-neutral-800'>
        <form onSubmit={send_message} className='fixed bottom-10'>
          <input name='message-box' className='bg-neutral-800 text-white py-2 px-4 rounded-l-lg' type='text' placeholder='Write something...' value={message} onChange={e => set_message(e.target.value)}/>
          <input className='bg-green-500 text-white font-bold py-2 px-10 rounded-r-lg hover:bg-green-700' type='submit' value='Send' />
        </form>
      </div>
    </div>
  </div>
);
}

export default App;
