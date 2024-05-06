import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {Routes, Route, redirect} from 'react-router-dom'
import { useNavigate,Link,useParams } from 'react-router-dom';
import Navbar from './navbar.jsx'
import UpdateCard from './update_card.jsx'
import './home.css'


function Update() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [mongoList, setMongoList] = useState([]);
    const navigate = useNavigate();
    let { username } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5555/blog/update/${username}`);
                setMongoList(res.data.data);
                res.data.data.forEach((blog) => {
                    setList((l) => [...l, {title: blog.title, _id: blog._id, content: blog.content, tag: blog.tag, date: blog.createdAt}]);
                    // setList((l) => [...l, blog.blog]);
                });
                if (res.data.length == 0){
                  setLoading("Please post a blog first!");
                }
            } catch (error) {
                console.log(error, "try block error");
            }
        }

        fetchData();
    }, []);
    
  
    // function formatDate(i) {  
    //   const blogDate = new Date(list[i].date);
    //   const day = blogDate.getDate().toString().padStart(2, '0');
    //   const month = (blogDate.getMonth() + 1).toString().padStart(2, '0');
    //   const year = blogDate.getFullYear().toString().slice(-2);
    //   const formattedDate = `${day}.${month}.${year}`;
    //   return formattedDate;
    // }

    function limitString(text, wordLimit, charLimit) {
      return text.trim().split(/\s+/).slice(0, wordLimit).join(' ').slice(0, charLimit) + (text.length > charLimit || text.split(/\s+/).length > wordLimit ? '...' : '');
  }

    return (
      <>
        <Navbar />
        <div className='container'>
          <div className='row'>
          {list.length > 0 ? (
        <>
            <div className='col1'>
            {list.slice(4, 11).map((item, index) => (
                <UpdateCard key={index} blog={item} title={{ words: 20, letters: 100 }} content={{ words: 30, letters: 200 }} />
              ))}
            </div>
            <div className='col2'>
              {list.slice(0, 4).map((item, index) => (
                <UpdateCard key={index} blog={item} title={{ words: 20, letters: 100 }} content={{ words: 80, letters: 500 }} />
              ))}
            </div>
            <div className='col3'>
            {list.slice(11, 18).map((item, index) => (
                <UpdateCard key={index} blog={item} title={{ words: 20, letters: 100 }} content={{ words: 30, letters: 200 }} />
              ))}
            </div>
            </>
      ) : (
        <div>{loading}</div>
      )}
          </div>
        </div>
      </>
    );
}

export default Update;
