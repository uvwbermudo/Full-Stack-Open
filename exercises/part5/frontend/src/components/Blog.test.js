import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe( '<Blog/>', () => {
  let blog
  let blogUser
  let triggerBlogUpdate
  let notifyUser
  let blogContainer
  let handleLike
  beforeEach(() => {
    blog =   {
      'title': 'Dank Blog',
      'author': 'Juju',
      'url': 'dank.url',
      'likes': 17,
      'creator': {
        'username': 'root',
        'name': 'root',
        'id': '65b47d7d82ca089264b539ba'
      },
      'id': '65b9efd3c8a10a3035f2113b'
    }

    blogUser = {
      'username': 'root',
      'name': 'root',
      'id': '65b47d7d82ca089264b539ba'
    }

    triggerBlogUpdate = jest.fn()
    notifyUser = jest.fn()
    handleLike = jest.fn()

    blogContainer = render(
      <Blog triggerBlogUpdate={triggerBlogUpdate}
        notifyUser={notifyUser}
        user={blogUser}
        blog={blog}
        handleLike={handleLike}/>
    ).container
  })

  test('Blog title and author is rendered but the rest is hidden', () => {
    const element = screen.getByText('Dank Blog by Juju')
    expect(element).toBeDefined()
  })

  test('URL and likes are shown when blog list is expanded', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const queryUrl = blogContainer.querySelector('.blogUrl')
    const queryLikes = blogContainer.querySelector('.blogLikes')

    expect(queryUrl).not.toHaveStyle('display: none')
    expect(queryLikes).not.toHaveStyle('display: none')
  })

  test('Like is clicked twice and event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('Show')
    await user.click(button)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)

  })

})