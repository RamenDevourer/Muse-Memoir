import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './blog.css'
import serverUrl from './server_url.jsx'


function DeleteBlog() {
    const [blog, setBlog] = useState("loading");
    const [mongoList, setMongoList] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${serverUrl}/blog/${id}`);
                setBlog(res.data);
            } catch (error) {
                console.log(error, "try block error");
            }
        }
    console.log(blog);
        fetchData();
    }, []);

    

    function limitString(text, wordLimit, charLimit) {
        return text.trim().split(/\s+/).slice(0, wordLimit).join(' ').slice(0, charLimit) + (text.length > charLimit || text.split(/\s+/).length > wordLimit ? '...' : '');
    }

    const blogDate = new Date(blog.createdAt);
    const day = blogDate.getDate().toString().padStart(2, '0');
    const month = (blogDate.getMonth() + 1).toString().padStart(2, '0');
    const year = blogDate.getFullYear().toString().slice(-2);
    const formattedDate = `${day}.${month}.${year}`;
    
    const handleDelete = async () => {
        var Token = localStorage.getItem('accessToken');
        await axios
        .delete(`${serverUrl}/blog/${id}`, 
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
  
    return (
      <>
        <Navbar />
        <div className='container'>
          <div className='row blog-row'>
          {(blog != "loading" && blog != undefined) ? (
        <>
            <div className='container blog-container'>
                <div className='blog-title'>
                    {blog.title}
                </div>
                <div className='blog-userinfo'>
                    {formattedDate} | by {blog.username}
                </div>
                <hr />
                <div className='tag-container'>
                    <div className='blog-tag'>
                        {blog.tag}
                    </div>
                </div>
                <div className='blog-content delete-bottom'>
                    {blog.content}
                </div>
                <div className='post-container'><button onClick={handleDelete} className='post delete-button'>Delete</button></div>
            </div>
              
        </>
      ) : (
        <div>Loading...</div>
      )}
          </div>
        </div>
      </>
    );
}

export default DeleteBlog;
