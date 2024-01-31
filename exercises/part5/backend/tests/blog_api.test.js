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
  }, 10000)
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)  
  }, 10000)

  test('identifier is id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  }, 10000)

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
  }, 10000)
  
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
    
  }, 10000)
  
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
}, 10000)



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
  }, 10000)

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
  }, 10000)
  
  test('malformatted id returns 400', async () => {
    const userToken = await loginAndGetToken()
    const malformattedId = '5a3d5da59070081a82a3445'
    await api
      .delete(`/api/blogs/${malformattedId}`)
      .set('Authorization', 'Bearer '+ userToken)
      .expect(400)
      
  }, 10000)
})

describe('updating blogs', () => {
  test('like is updated', async () => {
    const userToken = await loginAndGetToken()

    const newBlog = {
      title: 'Blog to like',
      author: 'BlogToLikeAuthor',
      url: 'url.tolike'
    }
    
    //! definitely turn this into function before you copy paste this the next time you need this
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const createdBlog = response.body
    
    const blogToUpdateObject = {
      title: createdBlog.title,
      author: createdBlog.author,
      url: createdBlog.url,
      creator: createdBlog.creator,
      likes: 1000
    }
  
    await api
      .put(`/api/blogs/${createdBlog.id}`)
      .set('Authorization', 'Bearer '+ userToken)
      .send(blogToUpdateObject)
      .expect(200)
    
    const updatedBlog = await api
      .get(`/api/blogs/${createdBlog.id}`)
      .expect(200)
  
    expect(updatedBlog.body.likes).toEqual(1000)
  }, 10000)

  test('malformatted id returns 400', async () => {
    const userToken = await loginAndGetToken()

    const malformattedId = '5a3d5da59070081a82a3445'
    //! definitely turn this into function before you copy paste this the next time you need this
    const newBlog = {
      title: 'Blog to updated',
      author: 'BlogToupdatedAuthor',
      url: 'url.toupdated'
    }
    
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const createdBlog = response.body
    
    const blogToUpdateObject = {
      title: createdBlog.title,
      author: createdBlog.author,
      url: createdBlog.url,
      creator: createdBlog.creator,
      likes: 1000
    }
  
    await api
      .put(`/api/blogs/${malformattedId}`)
      .set('Authorization', 'Bearer '+ userToken)
      .send(blogToUpdateObject)
      .expect(400)
  }, 10000)

})

afterAll(async () => {
  mongoose.connection.close()
})