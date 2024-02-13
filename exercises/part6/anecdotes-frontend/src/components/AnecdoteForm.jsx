import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()


  const handleAddAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={handleAddAnecdote}>
        <div><input name="content"/></div>
        <button type="submit">create</button>
      </form>
    </>
    )
}

export default AnecdoteForm