import { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = (props) => {
  const { createBlog } = props
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleAddBlog = async (event) => {
    event.preventDefault()
    await createBlog({ title, url, author })
    setTitle('')
    setUrl('')
    setAuthor('')
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

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default AddBlogForm