import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)

}

const create = (recordObject) => {
  const request = axios.post(baseUrl, recordObject)
  return request.then(response => response.data)
}

const update = (id, updateRecordObject) => {
  const request = axios.put(`${baseUrl}/${id}`, updateRecordObject)
  return request.then(response => response.data)
}

const deleteRecord = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, create, update, deleteRecord}