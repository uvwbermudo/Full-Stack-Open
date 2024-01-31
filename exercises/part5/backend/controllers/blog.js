const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.post('/', async (request, response, next) => {
  const {title, author, url, likes} = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json( { error: 'token invalid' })
  }

  const blogCreator = request.user
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    creator: blogCreator._id
  })
  const savedBlog = await blog.save({ runValidators: true })
  const savedPopulatedBlog = await savedBlog.populate('creator', { username: 1, name: 1, _id: 1})
  blogCreator.blogs = blogCreator.blogs.concat(savedBlog._id)
  await blogCreator.save()
  response.status(201).json(savedPopulatedBlog)

})

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('creator', { username: 1, name: 1, _id: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('creator', { username: 1, name: 1, _id: 1})
  response.json(blog)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json( { error: 'token invalid' })
  }
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete){
    if (blogToDelete.creator.toString() !== decodedToken.id) {
      return response.status(401).json({ error: 'invalid user' })
    }
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    creator: body.creator._id
  }
  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, content: 'query' })
    .populate('creator', { username: 1, name: 1, _id: 1})
  response.json(updatedBlog)
})

module.exports = blogRouter