import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams,Link } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './login.css'

function Dashboard() {
    const [loading, setLoading] = useState("loading");
    const [username, setUsername] = useState("loading");
    const [mongoList, setMongoList] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                var Token = localStorage.getItem('accessToken');

                const res = await axios.get(`http://localhost:5555/auth/protected`, {
                    headers: {
                        'Authorization': `Bearer ${Token}`
                    }
                });
                setUsername(res.data.username);
                setLoading('')
            } catch (error) {
                if (error.response.data.message == 'Invalid token'){
                    setLoading('Not Logged In... redirecting in 3 seconds')
                }
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
                console.log(error, "try block error");
            }
        }
    console.log(username);
        fetchData();
    }, []);

    function handleLogout(){
        localStorage.removeItem('accessToken');
        navigate('/login');
    };    

    function limitString(text, wordLimit, charLimit) {
        return text.trim().split(/\s+/).slice(0, wordLimit).join(' ').slice(0, charLimit) + (text.length > charLimit || text.split(/\s+/).length > wordLimit ? '...' : '');
    }
    
  
    return (
      <>
        <Navbar />
        {(loading == "") ? (
        <>
        <div className='container login-container dashboard-container'>
        <div className='login-card dashboard-card'>
          <span className='login-title dashboard-title'>{username},</span>
          <hr/>
          <span className='login-title dashboard-button'><Link to='/create' >Create</Link></span>
          <span className='login-title dashboard-button'><Link to={`/update/${username}`} >Update</Link></span>
          <span className='login-title dashboard-button'>Delete</span>
          <button onClick={handleLogout} className='logout-button'><span className='login-title dashboard-button logout'>Logout</span></button>
          </div>
        </div>
        </>
      ) : (
        <div className='container'>{loading}</div>
      )}
      </>
    );
}

export default Dashboard;
