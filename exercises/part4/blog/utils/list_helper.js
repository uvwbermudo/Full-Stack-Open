const dummyBlogs = [
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

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumLikes = (acc, currentValue) => {
    return acc + currentValue.likes
  }

  return blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  const top = blogs.reduce((prev, curr) => {
    return prev.likes > curr.likes
      ? prev
      : curr
  }, 0)

  return {
    title: top.title,
    author: top.author,
    likes: top.likes
  }
}

const authorWithMostBlogs = (blogs) => {
  const blogCounts = blogs.reduce((authorCount, blog) => {
    if (authorCount[blog.author]) {
      authorCount[blog.author] ++ 
    } else {
      authorCount[blog.author] = 1
    }
    return authorCount

  }, {})

  const mostBlogsAuthor = Object.keys(blogCounts).reduce((prev, curr) => {
    return blogCounts[prev] > blogCounts[curr] ? prev : curr
  })

  return {
    author: mostBlogsAuthor,
    blogs: blogCounts[mostBlogsAuthor]
  }
}

const authorWithMostLikes = (blogs) => {
  const likeCounts = blogs.reduce((authorLikes, blog) => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes
    } else {
      authorLikes[blog.author] = blog.likes
    }

    return authorLikes
  }, {})

  const mostLikesAuthor = Object.keys(likeCounts).reduce((prev, curr) => {
    return likeCounts[prev] > likeCounts[curr] ? prev : curr
  })

  return {
    author: mostLikesAuthor,
    likes: likeCounts[mostLikesAuthor]
  }
}


module.exports = {
  dummy,
  totalLikes,
  dummyBlogs,
  favoriteBlog,
  authorWithMostBlogs,
  authorWithMostLikes
}