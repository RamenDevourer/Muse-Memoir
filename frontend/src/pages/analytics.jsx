import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from './navbar.jsx';
import './login.css';
import './analytics.css';
import serverUrl from './server_url.jsx';

// Import and register chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [loading, setLoading] = useState("loading");
  const [username, setUsername] = useState("loading");
  const [totalPosts, setTotalPosts] = useState("loading");
  const [totalComments, setTotalComments] = useState("loading");
  const [totalViews, setTotalViews] = useState("loading");
  const [viewHistory, setViewHistory] = useState();
  const [recentBlogs, setRecentBlogs] = useState([]);

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
      setLoading('');

      const analytics = await axios.get(`${serverUrl}/blog/analytics/${res.data.username}`);
      const views = analytics.data.viewHistory;

      const viewsPerDay = views.reduce((acc, view) => {
        const date = new Date(view.timestamp).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = 1;
        } else {
            acc[date] += 1;
        }
        return acc;
      }, {});

      const timestamps = Object.keys(viewsPerDay).sort((a, b) => new Date(a) - new Date(b));
      
      const viewCounts = timestamps.map(date => viewsPerDay[date]);

        setTotalPosts(analytics.data.posts);
        setTotalViews(analytics.data.views);
        setTotalComments(analytics.data.comments);
        setRecentBlogs(analytics.data.recent);
        setViewHistory({
          data: {
            labels: timestamps,
            datasets: [
              {
                label: 'Views Per Day',
                data: viewCounts,
                fill: true,
                borderColor: 'rgba(80,80,80,1)',
                borderWidth: 2,
                tension: 0,
              }
            ],
          },
          options: {
            scales: {
              x: {
                grid: {
                  display: false, // Hide gridlines on the x-axis
                },
              },
              y: {
                grid: {
                  display: false, // Hide gridlines on the y-axis
                },
              },
            },
          },
        });
          
      } catch (error) {
        if (error.response.data.message === 'Invalid token') {
          setLoading('Not Logged In... redirecting in 3 seconds');
        }
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        console.log(error, "try block error");
      }
    };
    fetchData();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    navigate('/login');
  }

  return (
    <>
      <Navbar />
      {(loading === "") ? (
        <>
          <div className=''>
            <p className='login-title dashboard-title analytics-title'>Welcome Back, {username}!</p>
            <hr className='analytics-hr' />
            <div className='analytic-row'>
              <div className='analytic-col'>
                <div className='analytic-row'>
                  <div className='analytics-card'>
                    <p className='login-title dashboard-title analytics-card-name'>Total Posts</p>
                    <hr />
                    <p className='login-title dashboard-title analytics-card-name analytics-card-number'>{totalPosts}</p>
                  </div>
                  <div className='analytics-card'>
                    <p className='login-title dashboard-title analytics-card-name'>Total Views</p>
                    <hr />
                    <p className='login-title dashboard-title analytics-card-name analytics-card-number'>{totalViews}</p>
                  </div>
                  <div className='analytics-card'>
                    <p className='login-title dashboard-title analytics-card-name'>Total Comments</p>
                    <hr />
                    <p className='login-title dashboard-title analytics-card-name analytics-card-number'>{totalComments}</p>
                  </div>
                </div>

                <div className='analytics-card analytic-graph'>
                  <p className='login-title dashboard-title analytics-card-name'>Views Analytics Graph</p>
                  <hr />
                  {(viewHistory !== undefined) ? (<Line data={viewHistory.data} options={viewHistory.options} />) : (<p>No data available</p>)}
                </div>
              </div>
              <div className='analytic-row analytic-row-recent'>
                <div className='analytics-card analytics-recent'>
                  <p className='login-title dashboard-title analytics-card-name'>Recent Blogs</p>
                  <hr />
                    {recentBlogs.map((item, index) => (
                        <span className='login-title dashboard-title dashboard-button analytics-card-name analytics-recent-name'><Link to={`/blog/${item.id}`} >{item.title}</Link></span>
                    ))}
                  <div className='analytic-btn-box'>
                    <span className='login-title analytics-card-name dashboard-button'><Link to='/create' >+ Post New Blog</Link></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='container'>{loading}</div>
      )}
    </>
  );
}

export default Analytics;
