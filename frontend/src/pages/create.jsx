import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams,Link } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './blog.css'
import serverUrl from './server_url.jsx'

function Create() {
    
  const [titleRows, setTitleRows] = useState(1);
  const [contentRows, setContentRows] = useState(1);
  const [loading, setLoading] = useState("loading");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("loading");
  const [mongoList, setMongoList] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
      const fetchData = async () => {
          try {
              var Token = localStorage.getItem('accessToken');

              const res = await axios.get(`${serverUrl}/auth/protected`, {
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

  const handleTitleInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 150) {
      setTitle(inputValue);
    }

    const textareaLineHeight = 16*5;
    const previousRows = event.target.rows;
    event.target.rows = 1;
    const currentRows = Math.ceil(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    setTitleRows(currentRows);

  };

  const handleTagInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 25) {
      setTag(inputValue);
    }
  };

  const handleContentInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 15000) {
      setContent(inputValue);
    }

    const textareaLineHeight = 16*2.45;
    const previousRows = event.target.rows;
    event.target.rows = 1;
    const currentRows = Math.ceil(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    setContentRows(currentRows);
  };

  const handlePost = async () => {
    var Token = localStorage.getItem('accessToken');
    await axios
    .post(`${serverUrl}/blog/`, 
        { "title": title, "username": username, "content": content, "tag": tag },
        { headers: { 'Authorization': `Bearer ${Token}` } }
    )
    .then((res) => {
        navigate('/dashboard');
        console.log(res);
    })
    .catch((error) => {
        console.log(error.message);
    })
  };

  const blogDate = new Date();
  const day = blogDate.getDate().toString().padStart(2, '0');
  const month = (blogDate.getMonth() + 1).toString().padStart(2, '0');
  const year = blogDate.getFullYear().toString().slice(-2);
  const formattedDate = `${day}.${month}.${year}`;
  
    return (
      <>
        <Navbar />
        <div className='container'>
        <div className='row blog-row'>
        {(loading == "") ? (
        <>
          <div className='container blog-container'>
                    <textarea id="title-textarea" 
                      value={title}
                      onChange={handleTitleInputChange} 
                      rows={titleRows} 
                      className='blog-title' 
                      placeholder='Enter Title' 
                      maxlength={150}/>
                <div className='blog-userinfo'>
                    {formattedDate} | by {username}
                </div>
                <hr />
                <div className='tag-container'>
                        <input 
                        value={tag}
                        onChange={handleTagInputChange}
                        className='blog-tag'
                        placeholder='Enter Tag'/>
                </div>
                <div className='blog-content'>
                  <textarea 
                        value={content}
                        onChange={handleContentInputChange} 
                        className='blog-content blog-content-text' 
                        rows={contentRows}
                        placeholder='Start writing blog...'/>
                </div>
                <div className='post-container'><button onClick={handlePost} className='post'>Post</button></div>
                
            </div>
          </>
        ) : (
          <div className='container'>{loading}</div>
        )}
        </div>
        </div>
      </>
    );
}

export default Create;
