import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,useParams,Link } from 'react-router-dom';
import Navbar from './navbar.jsx'
import './home.css'


function Comment(props) {
    const title = props.title;
    const content = props.content;

    return (
      <>
        <div className='analytic-col comment-writebox recent-comment'>
          <div className='comment-recent-title'>
            {title}
          </div>
          <hr/>
          <div className='comment-recent-content'>
            {content}
          </div>
        </div>
      </>
    );
}

export default Comment;
