import { createStore, applyMiddleware, compose } from "redux";
import { apiMiddleware } from "redux-api-middleware";
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import rootReducer from "./reducers/";
let socket = io.connect('http://localhost:3001');
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");


const middleware = applyMiddleware(apiMiddleware, socketIoMiddleware);

const store = createStore(
  rootReducer,
  compose(
    middleware,
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

export default store;