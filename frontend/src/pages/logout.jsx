import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route} from 'react-router-dom'


function Logout() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios
        .post(`http://localhost:5555/auth/login`, {"username" : username, "password" : password})
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