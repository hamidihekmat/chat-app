import { v4 } from 'https://deno.land/std@0.95.0/uuid/mod.ts';

const sockets = new Map<string, WebSocket>();

type SocketMessage = {
  _id: string;
  clientEvent: ClientEvent;
  message?: string;
};

type ClientEvent =
  | 'CLIENT_CONNECTED'
  | 'CLIENT_DISCONNECTED'
  | 'MESSAGE_RECEIVED';

export const chatConnection = (ws: WebSocket) => {
  // aadd new ws to map
  const _id = v4.generate();
  sockets.set(_id, ws);

  ws.addEventListener('close', () => {
    sockets.delete(_id);
    console.log(
      ` connection closed for: ${_id}\n number of connections: ${sockets.size}`
    );
  });

  ws.addEventListener('open', () => {
    const message: SocketMessage = { _id, clientEvent: 'CLIENT_CONNECTED' };
    ws.send(JSON.stringify(message));
  });

  ws.addEventListener('message', ({ data }) => {
    console.log(JSON.parse(data));
    broadCastMessage(data);
  });
};

const broadCastMessage = (message: string) => {
  sockets.forEach((socket) => {
    try {
      socket.send(message);
    } catch (error) {
      console.log(error);
    }
  });
};
