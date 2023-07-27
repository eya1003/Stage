import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [peer, setPeer] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      });

    socket.on('me', (id) => {
      setMe(id);
      console.log('My ID:', id);
      // initialize peer to a new instance of Peer
      setPeer(new Peer({ initiator: false, trickle: false, stream }));
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, [me,socket]);

  const answerCall = () => {
    setCallAccepted(true);
    peer.signal(call.signal);
  };

  const callUser = (id) => {
    setCall({ isReceivingCall: true, from: me, name });
console.log(id);
    const newPeer = new Peer({ initiator: true, trickle: false, stream });
    newPeer.signal(id);

    newPeer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      newPeer.signal(signal);
    });

    connectionRef.current = newPeer;
    setPeer(newPeer);
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
