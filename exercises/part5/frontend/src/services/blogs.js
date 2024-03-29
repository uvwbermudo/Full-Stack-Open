import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blogObject) => {
  const config = {
    headers : { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const getById = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}`)
  return response.data
}

const deleteById = async (blogId) => {
  const config = {
    headers : { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

const update = async (blogId, blogObject) => {
  const config = {
    headers : { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${blogId}`, blogObject, config)
  return response.data
}

export default {
  getAll,
  setToken,
  create,
  update,
  getById,
  deleteById
}