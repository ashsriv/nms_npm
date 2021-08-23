import io from 'socket.io-client';
import { socketBaseUrl } from '../util/clientapis';    

export const createMySocketMiddleware = (url) => {
    let socket;
    const socketAction = url.toUpperCase();

    return storeAPI => next => action => {
        switch(action.type) {
            case "USER_LOGGED_IN" : {
                socket = createMySocket(url);
                
                socket.on('connected', (data) => {
                    console.log(`Subscribing for ${url} channels`);
                    socket.emit('subscribe', { topic: socketAction });
                    storeAPI.dispatch({ 
                        type: `${socketAction}_SOCKET_CONNECTED`, 
                        socketInfo: { socketConnected: true, type: socketAction } 
                    });
                });

                socket.on("update", (message) => {
                    storeAPI.dispatch({
                        type : `${socketAction}_MESSAGE_RECEIVED`,
                        payload : { [message.topic]: message.message }
                    });
                });

                socket.on("disconnect", (error)=>{
                    storeAPI.dispatch({ 
                        type: `${socketAction}_SOCKET_CONNECTED`, 
                        socketInfo: { socketConnected: false, type: socketAction } 
                    });
                })

                socket.on('reconnect', (attemptNumber) => {
                    storeAPI.dispatch({ 
                        type: `${socketAction}_SOCKET_CONNECTED`, 
                        socketInfo: { socketConnected: true, type: socketAction } 
                    });
                  });
                break;
            }
            case `${socketAction}_SEND_MESSAGE`: {
                socket.emit('subscribe', action.payload);
                return;
            }
            case `${socketAction}_LEAVE_MESSAGE`: {
                socket.emit('leave', action.payload);
                return;
            }
            case "USER_LOGGED_OUT" : {
                socket.emit("leave", { topic: socketAction });
                break;
            }
        }

        return next(action);
    }
}

function createMySocket(url) {
    let socket = io.connect(`${socketBaseUrl}${url}`, {
        reconnection: true,
        reconnectionDelay: 1000, //first wait before trying 1s
        reconnectionDelayMax : 5000, //wait between tries
        reconnectionAttempts: 99, //max attempts. after this socket doesnt connect,
    });
    return socket;
}
