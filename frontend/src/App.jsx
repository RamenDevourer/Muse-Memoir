import Login from './pages/login.jsx'
import Logout from './pages/logout.jsx'
import Create from './pages/create.jsx'
import Home from './pages/home.jsx'
import Blog from './pages/blog.jsx'
import Dashboard from './pages/dashboard.jsx'
import Register from './pages/register.jsx'
import Update from './pages/update.jsx'
import UpdateBlog from './pages/update_blog.jsx'
import {Routes, Route} from 'react-router-dom'


function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/create' element={<Create />} />
      <Route path='/' element={<Home />} />
      <Route path='/blog/:id' element={<Blog />} />
      <Route path='/updateblog/:id' element={<UpdateBlog />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/update/:username' element={<Update />} />
    </Routes>
  )
}

export default App;
