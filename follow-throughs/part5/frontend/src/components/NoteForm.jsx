import { useState } from "react"
import noteService from '../services/notes'


const NoteForm = (props) => {
  const {notes, setNotes, notifyError} = props
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService.create(noteObject)
      .then(response => {
        setNotes(notes.concat(response))
        setNewNote('')
      })
      .catch(error => {
        notifyError(error.response.data.error)
      })
  }

  return(
  <form onSubmit={addNote}>
    <input value={newNote} onChange={({ target }) => setNewNote(target.value)}/>
    <button type='submit'>Save</button>
  </form>

  )
}

export default NoteForm