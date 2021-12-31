import axios from 'axios'
const baseUrl = '/api/persons'

function getAllPersons() {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

function createPerson(newObject) {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

function updatePerson(id, newObject) {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

function deletePerson(id) {
  return axios.delete(`${baseUrl}/${id}`)
}

const exportedObj = {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
};

export default exportedObj;
