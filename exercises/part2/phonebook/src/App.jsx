import { useEffect, useState } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'


const Persons = (props) => {
  const {persons, handleDelete} = props
  return (
    <>
      {persons.map(record => 
        <div key={record.name}>
          {record.name} {record.number}
          <button onClick={() => handleDelete(event, record.id)}>Delete</button>
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

  const handleAddName = (event) => {
    event.preventDefault()
    let nameToAdd = newName.trim()
    const numberToAdd = newNumber.trim()
    if (nameToAdd == ''){
      alert('Name is required!')
      return
    }

    if (numberToAdd == '') {
      alert('Number is required!')
      return
    }
    nameToAdd = toTitleCase(nameToAdd)
    const nameExists = records.find(record => record.name === nameToAdd)
    const numberExists = records.find(record => record.number === numberToAdd)
    // handle existing name and update
    if (nameExists) {
      if (numberExists && numberExists.name !== nameExists.name) {
        alert (`${numberToAdd} is already being used by ${numberExists.name}`)
        return
      }
      if (window.confirm(`${nameExists.name} is already in the phonebook, replace the old number with the new one?`)){
        updateRecord(nameExists, numberToAdd)
      }
      return
    }

    if (numberExists) {
      alert (`${numberToAdd} is already being used by ${numberExists.name}`)
      return
    }
    const newRecord = {
      name: nameToAdd,
      number: numberToAdd
    }
    phonebookService.create(newRecord)
    .then(returnedRecord => {
      setRecords(records.concat(returnedRecord))
    })
  }

  const handleDelete = (event, id) => {
    const recordToDelete = records.find(record => record.id === id)
    if (window.confirm(`Delete ${recordToDelete.name}?`)) {
      phonebookService.deleteRecord(id)
      .then(returnedRecord => {
        setRecords(records.filter(record => record.id !== returnedRecord.id))
      })
    }
  }

  const updateRecord = (existingObject, newNumber) => {
    const updateRecordObject = {...existingObject, number: newNumber}
    phonebookService
      .update(existingObject.id, updateRecordObject)
      .then(returnedRecord => {
        setRecords(records.map(record => record.id === existingObject.id ? returnedRecord : record))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
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