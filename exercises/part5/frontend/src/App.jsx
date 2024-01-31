import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [messageObject, setMessageObject] = useState(null)
  const [updatedBlogsTrigger, setUpdatedBlogsTrigger] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [updatedBlogsTrigger])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON){
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const triggerBlogUpdate = () => {
    setUpdatedBlogsTrigger(!updatedBlogsTrigger)
  }

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

  const createBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      triggerBlogUpdate()
      const message = `Added blog: ${returnedBlog.title} by ${returnedBlog.author}`
      notifyUser(message,'success')
      blogFormRef.current.toggleVisibility()
    } catch(exception) {
      notifyUser(exception.response.data.error, 'error')
    }
  }

  const blogFormRef = useRef()

  const blogsToShow = blogs.sort((prev, curr) => curr.likes - prev.likes)

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
      <Togglable openLabel='Add Blog' closeLabel='Cancel' ref={blogFormRef}>
        <AddBlogForm
          setBlogs={setBlogs}
          blogs={blogs}
          notifyUser={notifyUser}
          createBlog = {createBlog}
        />
      </Togglable>
      <br/>
      {blogsToShow.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          triggerBlogUpdate={triggerBlogUpdate}
          notifyUser={notifyUser}
          user={user}
        />
      )}
    </div>
  )
}

export default App