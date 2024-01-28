import { useState } from 'react'
import blogService from '../services/blogs'

const AddBlogForm = (props) => {
  const {setBlogs, blogs, notifyUser} = props
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({
        title, url, author
      })
      setBlogs(blogs.concat(returnedBlog))
      const message = `Added blog: ${returnedBlog.title}`
      notifyUser(message,'success')
      setTitle('')
      setUrl('')
      setAuthor('')
    } catch(exception) {
      notifyUser(exception.response.data.error, 'error')
    }
  } 
  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title
        <input 
          type="text" 
          value={title} 
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        url
        <input 
          type="text" 
          value={url} 
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <div>
        author
        <input 
          type="text" 
          value={author} 
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      
      <button type="submit">Create</button>
    </form>
  )
}


export default AddBlogForm