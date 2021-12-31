import React from 'react'
import personService from '../services/persons'

const Persons = ({ persons, setPersons, displayList }) => {
  const removePerson = (personToDelete) => {
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return
    }

    personService
      .deletePerson(personToDelete.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      })
  }

  return (
    <div>
      {displayList.map(person =>
        <p key={person.id}>
          {person.name} {person.number} <button onClick={() => removePerson(person)}>delete</button>
        </p>
      )}
    </div>
  );
}

export default Persons
