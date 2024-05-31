import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route} from 'react-router-dom'
import serverUrl from './server_url.jsx'


function Logout() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios
        .post(`${serverUrl}/auth/login`, {"username" : username, "password" : password})
        .catch((error) => {
            console.log(error.message);
        })
    };
  
    return (
      <>
        <button onClick={handleLogin}>Logout</button>
      </>
    );
}

export default Logout;