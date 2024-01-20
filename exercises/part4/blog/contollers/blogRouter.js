const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
})

module.exports = blogRouter