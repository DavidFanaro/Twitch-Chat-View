import React, { useCallback, useEffect, useState } from 'react';
import './App.global.css';
import tmi from 'tmi.js';
import { listenerCount } from 'process';

const client = new tmi.Client({
  options: {
    debug: true,
  },
  channels: ['David_Fanaro'],
  connection: {
    reconnect: true,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
type tMessage = {
  tag: string | undefined;
  message: string;
};
const setup = () => {
  client.connect();
};

export default function App() {
  const [logged, setLogged] = useState(false);
  const [messages, setMessages] = useState<tMessage[]>([]);

  useEffect(() => {
    setup();
    client.on('connected', () => {
      setLogged(true);
    });
    client.on('message', (_channel, tags, message, self) => {
      if (self) return;
      const mes: tMessage = {
        tag: tags['display-name'],
        message,
      };
      setMessages((m) => m.concat(mes));
    });
  }, []);

  return (
    <div>
      <h1>{logged ? 'connected' : 'not connected'}</h1>
      {messages
        ? messages?.map((i, j) => (
            <div key={j.toString()}>
              <h2>{i.tag}</h2>
              <h3>{i.message}</h3>
            </div>
          ))
        : null}
    </div>
  );
}
