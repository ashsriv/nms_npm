import io from 'socket.io-client';
import { socketBaseUrl } from '../../util/clientapis.js';
import { SOCKET_CONNECTED } from '../../util/consts';
import toastr from 'toastr';

export const createAndConnectSocket = () => {
	const socket = io.connect(`${socketBaseUrl}gauge`, {
	    reconnection: true,
      reconnectionDelay: 1000, //first wait before trying 1s
      reconnectionDelayMax : 5000, //wait between tries
      reconnectionAttempts: 99 //max attempts. after this socket doesnt connect
	});
	// socket.on('disconnect',  () => {
 //    if(socket.io.connecting.indexOf(socket) === -1){
 //      //you should renew token or do another important things before reconnecting
 //      socket.connect();
 //    }
 //  });
  return dispatch =>
  socket.on('connected', (data) => {
    console.log('Socket connected', data);
    dispatch({ type: SOCKET_CONNECTED, socketInfo: { socketConnected: true, socket } });
  });
}

export const createAndConnectSocketForAlerts = () => {
  const socket = io.connect(`${socketBaseUrl}alerts`, {
      reconnection: true,
   reconnectionDelay: 1000, //first wait before trying 1s
   reconnectionDelayMax : 5000, //wait between tries
   reconnectionAttempts: 99 //max attempts. after this socket doesnt connect
  });
  
  socket.on('connected', (data) => {
    console.log('Socket connected', data);
    socket.emit('subscribe',{topic:'Alert'});
    socket.on('update',(data) =>{
      //let parsedmesssage = JSON.parse(data.message)
      toastr.error(data.message);
    })
  });
}
