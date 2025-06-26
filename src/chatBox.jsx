import React from 'react';
import './App.css'

function ChatBox({value}) {
    return ( 
        <div className='chat-message'>
            {value !== undefined && value.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                {line}
                <br />
                </React.Fragment>
            ))}
        </div>
    );
}

export default ChatBox;