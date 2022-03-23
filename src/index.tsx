import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SignUpComponentFunctional from "./components/SignUpComponentFunctional";
import SuccessPage from "./components/SuccessPage";
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";

// Bootstrap-CSS import
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<SignUpComponentFunctional/>}/>
                <Route path={'/success'} element={<SuccessPage/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
