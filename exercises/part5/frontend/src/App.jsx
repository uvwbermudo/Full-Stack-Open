import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [messageObject, setMessageObject] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
      if (loggedUserJSON){
        const loggedUser = JSON.parse(loggedUserJSON)
        setUser(loggedUser)
        blogService.setToken(loggedUser.token)
      }
  }, [])

  const notifyUser = (message, type) => {
    if (!message || !type){
      return
    }
    setMessageObject({
      message: message,
      type: type
    })
    setTimeout(() => {
      setMessageObject(null)
    }, 5000)
  
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  if (!user) {
    return (
      <div>
        <Notification messageObject={messageObject}/>
        <Login setUser={setUser} notifyUser={notifyUser}/>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <div>logged in as {user.name}, hello!
        <button type='button' onClick={handleLogout}>Logout</button>
      </div>
      <br/>
      <Notification messageObject={messageObject}/>
      <AddBlogForm setBlogs={setBlogs} blogs={blogs} notifyUser={notifyUser}/>
      <br/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App