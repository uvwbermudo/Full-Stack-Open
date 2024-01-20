const listHelper = require('../utils/list_helper')

describe('favorite blogs', () => {
  test('with many blogs, only one result', () => {
    const result = listHelper.favoriteBlog(listHelper.dummyBlogs)
    const expectedResult = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    expect(result).toEqual(expectedResult)
  })
})
