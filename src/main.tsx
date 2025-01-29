import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from  'react-router-dom';
import { App } from './App.tsx'
import { HomePage } from './pages/home/index.tsx';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Optional, for Bootstrap's base stylesS

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)
