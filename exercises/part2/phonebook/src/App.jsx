import { useState } from 'react'


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
  const [records, setRecords] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  const [searchFilter, setSearchFilter] = useState('')
  const handleSearch = (event) => setSearchFilter(event.target.value)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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
    const nameToAdd = toTitleCase(newName.trim())
    const numberToAdd = newNumber.trim()
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