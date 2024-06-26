import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,Link } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './login.css'
import serverUrl from './server_url.jsx'


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalid, setInvalid] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        await axios
        .post(`${serverUrl}/auth/login`, {"username" : username, "password" : password})
        .then((res) => {
            setInvalid('');
            navigate('/dashboard');
            console.log(res);
            var token = res.data.accessToken;
            localStorage.setItem('accessToken', token);
        })
        .catch((error) => {
            setInvalid(error.response.data.message);
            console.log(error.message);
        })
    };

    const handleProtec = async () => {

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          // Handle case where access token is not available
          console.log("Access token not found");
          return;
      }

      axios.get(`${serverUrl}/auth/protected`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }})
      .then((res) => {
        setInvalid(false);
        // navigate('/create');
        console.log(res);
    })
      .catch((error) => {
      // navigate('/create');
      console.log(error.message);
  })
  };
  
    return (
      <>
      <Navbar />
      <div className='container login-container'>
        <div className='login-card'>
          <span className='login-title'>Login</span>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className='pass'
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <span className='invalid'>{invalid}</span>
          {/* <button onClick={handleProtec}>Protec</button> */}
          <hr/>
          <span className='login-text'>Don't have an account?</span>
          <Link to='/register'><button className='register'>Register</button></Link>
          </div>
      </div>
      </>
    );
}

export default Login;
