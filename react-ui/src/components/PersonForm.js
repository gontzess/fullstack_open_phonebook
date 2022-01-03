import React, { useState } from 'react'
import personService from '../services/persons'

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (formData) => {
    personService
      .createPerson(formData)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(error.response.data.error);
      })
  }

  const updateExistingPerson = (id, formData) => {
    const isConfirmed = window.confirm(`${formData.name} is already added to the phonebook, replace the old number with a new one?`)

    if (!isConfirmed) {
      return
    }

    personService
      .updatePerson(id, formData)
      .then(returnedPerson => {
        setPersons(persons.map(per => per.id !== id ? per : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        alert(error.response.data.error);
        setPersons(persons.filter(per => per.id !== id))
        setNewName('')
        setNewNumber('')
      })
  }

  const submitPerson = (event) => {
    event.preventDefault()
    if (!newNumber) {
      return alert(`please enter a number`)
    }

    const existingPerson = persons.find(person => person.name === newName)
    const formData = {
      name: newName,
      number: newNumber,
    }

    if (existingPerson) {
      updateExistingPerson(existingPerson.id, formData)
    } else {
      addPerson(formData)
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  return (
    <form onSubmit={submitPerson}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm
