import noteService from '../services/notes'

const Note = ({note, setNotes, notes}) => {

  const toggleImportanceOf = (id) => {
    const changedNote = {...note, important: !note.important}

    noteService.update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
          console.log(error)
      })
  }

  const label = note.important ?
    'make not important': 'make important'

  return (
    <>
      <li className="note">
        {note.content} 
        <button onClick={() => toggleImportanceOf(note.id)}>{label}</button>
      </li>
    </>
  )
}

export default Note