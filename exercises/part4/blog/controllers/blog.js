const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.post('/', async (request, response,next) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save({ runValidators: true })
  response.status(201).json(savedBlog)

})

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, content: 'query' })
  response.json(updatedBlog)
})

module.exports = blogRouter