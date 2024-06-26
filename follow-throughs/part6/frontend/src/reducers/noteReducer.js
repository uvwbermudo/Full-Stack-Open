import { createSlice, current } from "@reduxjs/toolkit"
import noteService from "../services/noteService"

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {

    appendNote(state, action) {
      state.push(action.payload)
    },

    setNotes(state, action) {
      return (action.payload)
    },

    updateNote(state, action) {
      const id = action.payload.id
      return state.map(note => note.id !== id ? note : action.payload)
    }

  }
})

export const { appendNote, setNotes, updateNote } = noteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))

  }
}

export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export const toggleImportanceOf = note => {
  return async dispatch => {
    const newNote = await noteService.toggleImportance(note)
    dispatch(updateNote(newNote))
  }
}

export default noteSlice.reducer
