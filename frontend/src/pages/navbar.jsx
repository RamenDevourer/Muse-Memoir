import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,Link } from 'react-router-dom';
import logo from '../assets/muse_memoir.webp'


function Navbar() {
  const navigate = useNavigate();

    return (
      <>
      <div className='container'>
        <div className='navbar'>
          <Link to='/'><img className='logo' src={logo} ></img></Link>
          <Link to='/'><div className='navbar-title'>MuseMemoir</div></Link>
          <Link to='/dashboard'><span class="material-symbols-outlined">person_2</span></Link>
        </div>
      </div>
      </>
    );
}

export default Navbar;
