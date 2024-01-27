const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const initialUsers = [
  {
    username: "root",
    name: "root",
    blogs: [],
    _id: "65b47d7d82ca089264b539ba",
    passwordHash: "$2b$10$yQ352rtsUPyrKEENi4XLKeRZaJCaX9nO/hgnu1lKzsd1x9ndO9SEy",
    __v: 0
  },
  {
    username: "Dummy1",
    name: "Dummy1",
    blogs: [],
    passwordHash: "$2b$10$AkC81IlBDfGPxc1Eh7vwZ.3N9ORUVNgVhEfMa/0naYv1boqfGTIHS",
    _id: "65b47d9682ca089264b539bc",
    __v: 0
  },
  {
    username: "Dummy2",
    name: "Dummy2",
    blogs: [],
    passwordHash: "$2b$10$07dCD2xp9/3rBVDA9Zalt.uXsXvKhQLGjsFgUlZthiBsNxpUMlPOC",
    _id: "65b47da382ca089264b539be",
    __v: 0
  },
  {
    username: "Dummy3",
    name: "Dummy3",
    blogs: [],
    passwordHash: "$2b$10$NF/lROzWTN0DAZCx1TDR6OLtbiGW.febqmESFj86PQVpi10nAzcFG",
    _id: "65b47dbc82ca089264b539c0",
    __v: 0
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovethissoon', 
    author: 'willremovethissoon', 
    url: 'willremovethissoon',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  initialUsers,
  usersInDb,
}