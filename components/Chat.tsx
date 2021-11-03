import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { SocketMessage } from '../interface/socket';

let socket: null | WebSocket;
if (process.browser) {
  socket = new WebSocket('ws://warm-robin-64.deno.dev/ws');
}
export const Chat = () => {
  const [messages, setMessages] = useState<SocketMessage[]>();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.send(JSON.stringify({ username, message }));
    setMessage('');
  };
  useEffect(() => {
    socket?.addEventListener('open', () => console.log('connected to server'));
    socket?.addEventListener('message', ({ data }) => {
      const socketMessage = JSON.parse(data) as SocketMessage;
      if (socketMessage.clientEvent === 'CLIENT_CONNECTED') {
        setUsername(socketMessage._id);
      } else {
        console.log(socketMessage);
        setMessages((state) =>
          state ? [...state, socketMessage] : [socketMessage]
        );
      }
    });
  }, []);
  return (
    <div>
      <h1>Chat App</h1>
      {username && <h2>{username}</h2>}
      <div className="chat">
        <ul>
          {messages?.map(({ message }) => (
            <li key={message}>
              <div className="message">
                {username}: {message}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={onSubmit}>
        <input type="text" name="message" value={message} onChange={onChange} />
        <button type="submit" disabled={!message}>
          Send
        </button>
      </form>
    </div>
  );
};
