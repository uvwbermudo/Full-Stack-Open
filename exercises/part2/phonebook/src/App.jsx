import { useEffect, useState } from 'react'
import axios from 'axios'


const Persons = (props) => {
  const {persons} = props
  return (
    <>
      {persons.map(record => <div key={record.name}>{record.name} {record.number}</div>)}
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
    console.log('Effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise Done!')
        setRecords(response.data)
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
    const nameExists = records.filter(record => record.name === nameToAdd)
    const numberExists = records.filter(record => record.number === numberToAdd)
    if (nameExists.length > 0) {
      alert(`${nameToAdd} is already added in the phonebook!`)
      return
    }
    if (numberExists.length > 0) {
      alert (`${numberToAdd} is already being used by ${numberExists[0].name}`)
      return
    }
    const newRecord = {
      name: nameToAdd,
      number: numberToAdd
    }
    setRecords(records.concat(newRecord))
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
      <Persons persons={recordsToShow}></Persons>
    </div>
  )
}

export default App