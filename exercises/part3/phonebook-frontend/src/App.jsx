import { useEffect, useState } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'
import './index.css'


const Notification = (props) => {
  const {messageObject} = props

  if (!messageObject) {
    return null
  }
  
  if (messageObject.type === 'success'){
    return (
      <div className='success'>{messageObject.message}</div>
    )
  } else if (messageObject.type === 'error') {
    return (
      <div className='error'>{messageObject.message}</div>
    )
  }
}

const Persons = (props) => {
  const {persons, handleDelete} = props
  const buttonStyle = {
    marginLeft: 5,
  }

  return (
    <>
      {persons.map(record => 
        <div key={record.name}>
          {record.name} {record.number}
          <button style={buttonStyle} onClick={() => handleDelete(event, record.id)}>Delete</button>
        </div>
      )}
    </>
  )
}

const Filter = (props) => {
  const {handleSearch} = props
  return <h4>Search a Name: <input onChange={handleSearch}/></h4> 
}

const PersonForm = (props) => {
  const {handleAddName, handleNewNameChange, handleNewNumberChange, newName, newNumber} = props
  return (
    <form onSubmit={handleAddName}>
        <div>Name: <input value={newName} onChange={handleNewNameChange} /></div>
        <div>Number: <input value ={newNumber} onChange={handleNewNumberChange} type='tel'/></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const App = () => {
  const [records, setRecords] = useState([]) 
  const [searchFilter, setSearchFilter] = useState('')
  const handleSearch = (event) => setSearchFilter(event.target.value)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [messageObject, setMessageObject] = useState(null)

  const hook = () => {
    phonebookService.getAll()
    .then(initialRecords => {
      setRecords(initialRecords)
    })
  }

  useEffect(hook, [])

  const recordsToShow = !searchFilter.trim()
  ? records
  : records.filter(record => record.name.toLowerCase().includes(searchFilter.trim().toLowerCase()))

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const handleNewNameChange = (event) => setNewName(event.target.value)

  const handleNewNumberChange = (event) => setNewNumber(event.target.value)

  const notifyUser = (message, type) => {
    if (!message || !type){
      return
    }
    setMessageObject({
      message: message,
      type: type
    })
    setTimeout(() => {
      setMessageObject(null)
    }, 5000)
  
  }

  const handleAddName = (event) => {
    event.preventDefault()
    let nameToAdd = newName.trim()
    const numberToAdd = newNumber.trim()
    if (nameToAdd == ''){
      notifyUser('Could not add, name is required!', 'error')
      return
    }

    if (numberToAdd == '') {
      notifyUser('Could not add, number is required!', 'error')
      return
    }
    nameToAdd = toTitleCase(nameToAdd)
    const nameExists = records.find(record => record.name === nameToAdd)
    const numberExists = records.find(record => record.number === numberToAdd)
    // handle existing name and update
    if (nameExists) {
      if (numberExists && numberExists.name !== nameExists.name) {
        notifyUser(`Could not update, ${numberToAdd} is already being used by ${numberExists.name}`, 'error')
        return
      }
      if (window.confirm(`${nameExists.name} is already in the phonebook, replace the old number with the new one?`)){
        updateRecord(nameExists, numberToAdd)
      }
      return
    }

    if (numberExists) {
      notifyUser(`${numberToAdd} is already being used by ${numberExists.name}`, 'error')
      return
    }
    const newRecord = {
      name: nameToAdd,
      number: numberToAdd
    }
    phonebookService
      .create(newRecord)
      .then(returnedRecord => {
        setRecords(records.concat(returnedRecord))
        const newMessage = `Added ${returnedRecord.name}`
        notifyUser(newMessage, 'success')
      })
      .catch(error => {
        console.log(error)
        const newMessage = error.response.data.error
        console.log(newMessage)
        notifyUser(newMessage, 'error')
      })
  }

  const handleDelete = (event, id) => {
    const recordToDelete = records.find(record => record.id === id)
    if (window.confirm(`Delete ${recordToDelete.name}?`)) {
      phonebookService.deleteRecord(id)
      .then(response => {
        if (response.status === 204){
          setRecords(records.filter(record => record.id !== recordToDelete.id))
          const newMessage = `Deleted ${recordToDelete.name}`
          notifyUser(newMessage, 'success')
        } else {
          const newMessage = `There was an error deleting ${recordToDelete.name}`
          notifyUser(newMessage, 'error')
        }

      })
      .catch(err => {
        if (err.response.status === 404){
          setRecords(records.filter(record => record.id !== recordToDelete.id))
          const newMessage = `Information of ${recordToDelete.name} has already been removed from the server`
          notifyUser(newMessage, 'error')
        }
      })
    }
  }

  const updateRecord = (existingObject, newNumber) => {
    const updateRecordObject = {...existingObject, number: newNumber}
    phonebookService
      .update(existingObject.id, updateRecordObject)
      .then(returnedRecord => {
        setRecords(records.map(record => record.id === existingObject.id ? returnedRecord : record))
        const newMessage = `Updated ${returnedRecord.name}`
        notifyUser(newMessage, 'success')
      })
      .catch(err => {
        if (err.response.status === 404){
          setRecords(records.filter(record => record.id !== updateRecordObject.id))
          const newMessage = `Information of ${updateRecordObject.name} has already been removed from the server`
          notifyUser(newMessage, 'error')
        } else if (err.response.status === 400){
          const newMessage = err.response.data.error
          notifyUser(newMessage, 'error')
        }
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageObject={messageObject}></Notification>
      <Filter handleSearch={handleSearch}></Filter>
      <h2>Add a new record</h2>
      <PersonForm 
        handleAddName={handleAddName} 
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
        newName={newName}
        newNumber={newNumber}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={recordsToShow} handleDelete={handleDelete}></Persons>
    </div>
  )
}

export default App