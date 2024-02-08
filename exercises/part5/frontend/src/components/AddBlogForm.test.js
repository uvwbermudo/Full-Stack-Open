import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'


describe('<AddBlogForm/>', () => {
  let addBlogForm
  let createBlog
  beforeEach(() => {
    createBlog = jest.fn()
    addBlogForm = render(
      <AddBlogForm
        createBlog={createBlog}
      />
    ).container
  })

  test('Creating blog calls the handlers and has correct details', async () => {
    const titleInput = addBlogForm.querySelector('input[name=\'title\']')
    const urlInput = addBlogForm.querySelector('input[name=\'url\']')
    const authorInput = addBlogForm.querySelector('input[name=\'author\']')

    const user = userEvent.setup()
    const submitButton = screen.getByText('Create')
    await user.type(titleInput, 'Test Title')
    await user.type(urlInput, 'Test URL')
    await user.type(authorInput, 'Test Author')
    await user.click(submitButton)

    expect(createBlog).toHaveBeenCalledWith({
      title: 'Test Title',
      url: 'Test URL',
      author: 'Test Author'
    })
  })
})