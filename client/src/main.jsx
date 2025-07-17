import React from 'react';
import ReactDOM from 'react-dom/client';  
import './home.css';
import App from './App.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './apollo';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

