import { useState, useEffect } from 'react'
import Note from './components/Note.jsx'
import LoginForm from './components/Login.jsx'
import noteService from './services/notes'
import NoteForm from './components/NoteForm.jsx'
import Notification from './components/Notification.jsx'
import Footer from './components/Footer.jsx'
import './index.css'


const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }
  useEffect(hook, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON){
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      noteService.setToken(loggedUser.token)
    }
  }, [])

  const notifyError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handeLogout = () => {
    setUser(null)
    noteService.setToken(null)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}></Notification>
      {!user  && (<LoginForm setUser={setUser} user={user}/>)}
      {user && 
        <div>
          <p>{user.name} logged in</p>
          <NoteForm notes={notes} setNotes={setNotes} notifyError={notifyError}/>
          <div>
            <button type="button" onClick={handeLogout}>Logout</button>
          </div>
        </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'Important' : 'All'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} setNotes={setNotes} notes={notes}/>)}
      </ul>
      <Footer></Footer>
    </div>
  )
}

export default App

