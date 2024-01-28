const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

const loginAndGetToken = async () => {
  const userLogin = {
    username: 'root',
    password: 'root'
  }
  const response = await api
    .post('/api/login')
    .send(userLogin)
  
  return response.body.token
}

describe('when there are initiall saved blogs', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)  
  })

  test('identifier is id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

})

describe('creating blogs', () => {

  test('one valid blog is created, saved, and returned', async () => {
    const userToken = await loginAndGetToken()
    const newBlog = {
      title: "This is a test blog",
      author: "This is a test author",
      url: "url.test",
      likes: 999
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(blog => blog.title)
  
    expect(titles).toContain(newBlog.title)
  })
  
  test('missing likes defaults to 0', async () => {
    const userToken = await loginAndGetToken()
    const newBlog = {
      title: "This is a test blog",
      author: "This is a test author",
      url: "url.test",
    }
    expect(newBlog.likes).not.toBeDefined()
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect(returnedBlog => {
        expect(returnedBlog.body.title).toEqual(newBlog.title)
        expect(returnedBlog.body.likes).toBeDefined()
        expect(returnedBlog.body.likes).toBe(0)
      })
    
  })
  
  test('missing properties should return 400', async () => {
    const userToken = await loginAndGetToken()
    const invalidBlogs = [
      {
        author: "This is a test author",
        url: "url.test",
      },
      {
        title: "This is a test blog",
      },
      {
  
      },
    ]
  
    for (const blog of invalidBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+ userToken)
        .send(blog)
        .expect(400);
    }
  })
})



describe('deleting blogs', () => {
  test('a blog with valid id is deleted and returns 204', async () => {
    const userToken = await loginAndGetToken()
    const newBlog = {
      title: "This is a test blog",
      author: "This is a test author",
      url: "url.test",
      likes: 999
    }
    const returnedBlog = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
    
    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', 'Bearer '+ userToken)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const blogsAtEndIds = blogsAtEnd.map(blog => blog.id)
    expect(blogsAtEndIds).not.toContain(returnedBlog.id)
  })

  test('valid non existing id returns 204', async () => {
    const userToken = await loginAndGetToken()
    const newBlog = {
      title: "This is a test blog",
      author: "This is a test author",
      url: "url.test",
      likes: 999
    }
    const returnedBlog = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
    
    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', 'Bearer '+ userToken)

    await api
      .delete(`/api/blogs/${returnedBlog.body.id}`)
      .set('Authorization', 'Bearer '+ userToken)
      .expect(204)
  })
  
  test('malformatted id returns 400', async () => {
    const userToken = await loginAndGetToken()
    const malformattedId = '5a3d5da59070081a82a3445'
    await api
      .delete(`/api/blogs/${malformattedId}`)
      .set('Authorization', 'Bearer '+ userToken)
      .expect(400)
      
  })
})

describe('updating blogs', () => {
  test('like is updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
  
    const blogToUpdateObject = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 1000
    }
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdateObject)
      .expect(200)
    
    const updatedBlog = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)
  
    expect(updatedBlog.body.likes).toEqual(1000)
  })

  test('malformatted id returns 400', async () => {
    const malformattedId = '5a3d5da59070081a82a3445'
  
    const blogToUpdateObject = {
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 1000
    }
  
    await api
      .put(`/api/blogs/${malformattedId}`)
      .send(blogToUpdateObject)
      .expect(400)
  })

})





afterAll(async () => {
  mongoose.connection.close()
})