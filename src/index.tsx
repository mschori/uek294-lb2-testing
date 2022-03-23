import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FirstComponent from "./components/FirstComponent";
import UserComponent from "./components/UserComponent";
import Counter from './components/FunctionalComponent';
import CounterClass from "./components/ClassComponent";
import BootstrapComponents from "./components/BootstrapComponents";
import SignUpComponent from "./components/SignUpComponent";
import SignUpComponentFunctional from "./components/SignUpComponentFunctional";
import Calculator from './components/Calculator';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        {/*<Counter initialCounter={6}/>*/}
        {/*<CounterClass initialCounter={10}/>*/}
        {/*<BootstrapComponents/>*/}
        {/*<SignUpComponent />*/}
        <SignUpComponentFunctional/>
        {/*<First   Component/>*/}
        {/*<UserComponent name={"Michael"} age={26} address={"Ballenbühlweg 11"} dob={new Date()}/>*/}
        {/*<Calculator />*/}
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
