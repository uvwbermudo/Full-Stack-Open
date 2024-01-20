const listHelper = require('../utils/list_helper')

describe('author with most blogs', () => {
  test('with many blogs, only one result', () => {
    const result = listHelper.authorWithMostBlogs(listHelper.dummyBlogs)

    const expectedResult = {
      author: "Robert C. Martin",
      blogs: 3
    }
    
    expect(result).toEqual(expectedResult)
  })
})