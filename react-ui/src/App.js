import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newQuery, setNewQuery] = useState('')
  const [displayList, setDisplayList] = useState([])

  useEffect(() => {
    personService
      .getAllPersons()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
  }, []);

  useEffect(() => {
    if (newQuery.length === 0) {
      setDisplayList(persons)
    } else {
      setDisplayList(
        persons.filter(person => {
          return person.name.toLowerCase().includes(newQuery.toLowerCase())
        })
      )
    }
  }, [newQuery, persons]);

  return (
    <>
      <h2>Phonebook</h2>
      <Filter
        newQuery={newQuery}
        setNewQuery={setNewQuery}
      />
      <h2>Add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        setPersons={setPersons}
        displayList={displayList}
      />
    </>
  )
};

export default App;
