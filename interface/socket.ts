export type SocketMessage = {
  _id: string;
  clientEvent: ClientEvent;
  message?: string;
};

type ClientEvent =
  | 'CLIENT_CONNECTED'
  | 'CLIENT_DISCONNECTED'
  | 'MESSAGE_RECEIVED';
