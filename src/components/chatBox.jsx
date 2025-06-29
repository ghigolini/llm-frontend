import React from 'react';
import ReactMarkdown from 'react-markdown';

function ChatBox({value}) {
    return ( 
        <div className='prose text-white my-5 border-2 border-neutral-700 rounded-lg p-4'>
            {value !== undefined && value.split('\n').map((line, index) => (
                <ReactMarkdown key={index}>
                {line}
                </ReactMarkdown>
            ))}
        </div>
    );
}

export default ChatBox;