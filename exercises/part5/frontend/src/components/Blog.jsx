import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const { blog, triggerBlogUpdate, notifyUser, user, handleLike } = props
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible? 'none' : '' }
  const showWhenVisible = { display: visible? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDelete = async (blogObject) => {
    const confirmDelete = window.confirm(`Delete the blog ${blogObject.title} by ${blogObject.author}?`)
    if (!confirmDelete) return

    try {
      await blogService.deleteById(blogObject.id)
      triggerBlogUpdate()
      const message = `Successfully deleted ${blogObject.title} by ${blogObject.author}`
      notifyUser(message,'success')
    } catch (exception) {
      notifyUser(exception.response.data.error, 'error')
    }
  }
  return (
    <div style={blogStyle} className='blogDiv'>
      {blog.title} by {blog.author}
      <button onClick={toggleVisibility} style={hideWhenVisible}>Show</button>
      <button onClick={toggleVisibility} style={showWhenVisible}>Hide</button>
      <div style={showWhenVisible}>
        <div className='blogUrl'>URL: {blog.url}</div>
        <div className='blogLikes'>Likes: {blog.likes}
          <button onClick={() => handleLike(blog)}>Like</button>
        </div>
        <div>{blog.creator.name}</div>
        {blog.creator.username === user.username
          ? (<button onClick={() => handleDelete(blog)}>Delete this blog</button>)
          : null
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  triggerBlogUpdate: PropTypes.func.isRequired,
  notifyUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog