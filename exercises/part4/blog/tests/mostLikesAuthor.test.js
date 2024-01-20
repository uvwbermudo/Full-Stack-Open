const listHelper = require('../utils/list_helper')

describe('author with most likes', () => {
  test('with many blogs, only one result', () => {
    const result = listHelper.authorWithMostLikes(listHelper.dummyBlogs)

    const expectedResult = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    console.log('Result', result)
    console.log('Expect', expectedResult)
    expect(result).toEqual(expectedResult)
  })
})