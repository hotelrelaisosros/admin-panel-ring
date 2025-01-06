import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "react-overlay-loader/styles.css";
import { Provider } from "react-redux";
import { persistor, store } from "./store/index";
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App";
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);