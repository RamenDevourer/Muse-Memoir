import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './blog.css'
import serverUrl from './server_url.jsx'
import Comment from './comment.jsx'

function Blog() {
    const [blog, setBlog] = useState("loading");
    const [comments, setComments] = useState();
    const [mongoList, setMongoList] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams();

    const [commentTitle, setCommentTitle] = useState("");
    const [commentContent, setCommentContent] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${serverUrl}/blog/${id}`);
                setBlog(res.data);
                console.log(res.data);
                setComments(res.data.comments.reverse());
            } catch (error) {
                console.log(error, "try block error");
            }
        }
        fetchData();
    }, []);

    


    const blogDate = new Date(blog.createdAt);
    const day = blogDate.getDate().toString().padStart(2, '0');
    const month = (blogDate.getMonth() + 1).toString().padStart(2, '0');
    const year = blogDate.getFullYear().toString().slice(-2);
    const formattedDate = `${day}.${month}.${year}`;
    
    const handleTitleInputChange = (event) => {
        const inputValue = event.target.value;
    
        if (inputValue.length <= 25) {
          setCommentTitle(inputValue);
        }
    };

    const handleContentInputChange = (event) => {
        const inputValue = event.target.value;
    
        if (inputValue.length <= 225) {
          setCommentContent(inputValue);
        }
    };

    const handlePost = async () => {
        var Token = localStorage.getItem('accessToken');
        await axios
        .post(`${serverUrl}/blog/${id}/comments`, 
            { "title": commentTitle, "content": commentContent},
            { headers: { 'Authorization': `Bearer ${Token}` } }
        )
        .then((res) => {
            console.log(res);
                navigate(`/`);
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
                <div className='blog-content'>
                    {blog.content}
                </div>

                <div className='comment-title'>
                    Comments
                </div>

                <div className='analytic-row'>
                    <div className='analytic-col comment-writebox comment-write'>
                        <div className='comment-heading'>
                            Write a comment<hr/>
                        </div>
                        <div className='comment-subheading'>
                            Heading
                        </div>
                        <input 
                            value={commentTitle}
                            onChange={handleTitleInputChange}
                            className='comment-input'
                            placeholder='Start writing heading...'/>
                        <div className='comment-subheading'>
                            Comment
                        </div>
                        <textarea 
                            value={commentContent}
                            onChange={handleContentInputChange} 
                            className='comment-input' 
                            rows={8}
                            placeholder='Start writing comment...'/>
                        <div className='analytic-row'><button onClick={handlePost} className='post'>Post Comment</button></div>
                    </div>
                    <div className='analytic-col comment-writebox recent-comments'>
                        <div className='comment-heading'>
                            Recent Comments<hr/>
                        </div>
                        <div>
                            {(comments.length!=0) ? (comments.slice(0, 5).map((item, index) => (
                                <Comment key={index} title={item.title} content={item.content}/>
                            ))) : (<p className='comment-input'>No comments yet, Start by writing you own!</p>) }
                        </div>
                    </div>
                </div>
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

export default Blog;
