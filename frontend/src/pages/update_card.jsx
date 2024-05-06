import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams,Link } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './home.css'


function UpdateCard(props) {
    const [mongoList, setMongoList] = useState([]);
    const navigate = useNavigate();
    let { id } = useParams();
    const blog = props.blog;
    const title = props.title;
    const content = props.content;

    function limitString(text, wordLimit, charLimit) {
        return text.trim().split(/\s+/).slice(0, wordLimit).join(' ').slice(0, charLimit) + (text.length > charLimit || text.split(/\s+/).length > wordLimit ? '...' : '');
    }

    return (
      <>
        <Link className='link' to={`/updateblog/${blog._id}`}>
              <div className='card'>
                <div className='title'>{limitString(blog.title, title.words, title.letters)}</div>
                {/* {formatDate(0)} */}
                <div className='tag'>{blog.tag}</div>
                <hr />
                <div className='content'>{limitString(blog.content, content.words, content.letters)}</div>
              </div></Link>
      </>
    );
}

export default UpdateCard;
