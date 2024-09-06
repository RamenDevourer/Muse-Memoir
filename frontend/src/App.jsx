import {Routes, Route} from 'react-router-dom'

import Login from './pages/login.jsx'
import Logout from './pages/logout.jsx'
import Create from './pages/create.jsx'
import Home from './pages/home.jsx'
import Blog from './pages/blog.jsx'
import Dashboard from './pages/dashboard.jsx'
import Analytics from './pages/analytics.jsx'
import Register from './pages/register.jsx'
import Update from './pages/update.jsx'
import UpdateBlog from './pages/update_blog.jsx'
import DeleteBlog from './pages/delete_blog.jsx'
import Delete from './pages/delete.jsx'



function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/blog/:id' element={<Blog />} />

      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />

      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/create' element={<Create />} />
      <Route path='/updateblog/:id' element={<UpdateBlog />} />
      <Route path='/update/:username' element={<Update />} />
      <Route path='/delete/:username' element={<Delete />} />
      <Route path='/deleteblog/:id' element={<DeleteBlog />} />
    </Routes>
  )
}

export default App;
